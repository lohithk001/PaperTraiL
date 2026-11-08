import { 
  CanActivate, 
  ExecutionContext, 
  Injectable, 
  UnauthorizedException,
  Logger
} from '@nestjs/common';
import { createClerkClient, verifyToken } from '@clerk/backend';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  private clerkClient: ReturnType<typeof createClerkClient> | null = null;

  constructor(private readonly prisma: PrismaService) {
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (secretKey) {
      this.clerkClient = createClerkClient({ secretKey });
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // Local development fallback when no Authorization header is passed
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (process.env.NODE_ENV !== 'production' && !process.env.CLERK_SECRET_KEY) {
        request.user = {
          id: 'user-demo-id',
          clerkId: 'clerk_demo_user',
          email: 'lohith.k@vault.io',
          fullName: 'Lohith Kumar',
          tagline: 'Personal Document Vault',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
          storageUsedBytes: 15518976,
          storageQuotaBytes: 524288000,
          encryptionEnabled: true,
          biometricEnabled: true,
          onboardingCompleted: false,
          onboardingStep: 1,
          selectedDocumentCategories: [],
          reminderPreferences: {
            documentExpiry: true,
            warrantyExpiry: true,
            insuranceRenewal: true,
            billPayment: true,
          },
          preferredLanguage: 'en',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return true;
      }
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    // If Clerk is configured, verify Clerk-issued session JWT
    if (this.clerkClient && process.env.CLERK_SECRET_KEY) {
      try {
        const verified = await verifyToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY,
          jwtKey: process.env.CLERK_JWT_KEY,
        });

        const clerkUserId = verified.sub;
        if (!clerkUserId) {
          throw new UnauthorizedException('Token payload missing subject identifier');
        }

        // Fetch user metadata from Clerk API
        const clerkUser = await this.clerkClient.users.getUser(clerkUserId);
        const email = clerkUser.emailAddresses[0]?.emailAddress || `${clerkUserId}@vault.io`;
        const fullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || clerkUser.username || 'Vault User';
        const avatarUrl = clerkUser.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80';

        // Synchronize authenticated user with PostgreSQL Prisma database
        let dbUser: any;
        try {
          dbUser = await this.prisma.user.upsert({
            where: { clerkId: clerkUserId },
            update: {
              email,
              fullName,
              avatarUrl,
            },
            create: {
              clerkId: clerkUserId,
              email,
              fullName,
              avatarUrl,
              storageQuotaBytes: BigInt(524288000), // 500 MB Free Tier
              onboardingCompleted: false,
              onboardingStep: 1,
              selectedDocumentCategories: [],
              reminderPreferences: {
                documentExpiry: true,
                warrantyExpiry: true,
                insuranceRenewal: true,
                billPayment: true,
              },
              preferredLanguage: 'en',
            },
          });
        } catch (dbErr) {
          this.logger.warn(`Database sync skipped (offline or uninitialized): ${dbErr}`);
          dbUser = {
            id: `user-${clerkUserId}`,
            clerkId: clerkUserId,
            email,
            fullName,
            avatarUrl,
            storageUsedBytes: BigInt(15518976),
            storageQuotaBytes: BigInt(524288000),
            encryptionEnabled: true,
            biometricEnabled: true,
            onboardingCompleted: false,
            onboardingStep: 1,
            selectedDocumentCategories: [],
            reminderPreferences: {
              documentExpiry: true,
              warrantyExpiry: true,
              insuranceRenewal: true,
              billPayment: true,
            },
            preferredLanguage: 'en',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }

        request.user = {
          ...dbUser,
          storageUsedBytes: Number(dbUser.storageUsedBytes),
          storageQuotaBytes: Number(dbUser.storageQuotaBytes),
          onboardingCompleted: Boolean(dbUser.onboardingCompleted),
          onboardingStep: Number(dbUser.onboardingStep || 1),
          selectedDocumentCategories: dbUser.selectedDocumentCategories || [],
          reminderPreferences: dbUser.reminderPreferences || {
            documentExpiry: true,
            warrantyExpiry: true,
            insuranceRenewal: true,
            billPayment: true,
          },
          preferredLanguage: dbUser.preferredLanguage || 'en',
          createdAt: dbUser.createdAt?.toISOString ? dbUser.createdAt.toISOString() : new Date().toISOString(),
          updatedAt: dbUser.updatedAt?.toISOString ? dbUser.updatedAt.toISOString() : new Date().toISOString(),
        };

        return true;
      } catch (err: any) {
        this.logger.error(`Clerk token verification failed: ${err.message || err}`);
        throw new UnauthorizedException('Invalid or expired authentication session');
      }
    }

    // Fallback when CLERK_SECRET_KEY is not yet provisioned in environment
    if (process.env.NODE_ENV === 'production') {
      throw new UnauthorizedException('Server authentication provider is not configured for production');
    }

    this.logger.warn('CLERK_SECRET_KEY is not set: falling back to mock user in non-production environment');
    request.user = {
      id: 'user-demo-id',
      clerkId: 'clerk_authenticated_user',
      email: 'lohith.k@vault.io',
      fullName: 'Lohith Kumar',
      tagline: 'Personal Document Vault',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      storageUsedBytes: 15518976,
      storageQuotaBytes: 524288000,
      encryptionEnabled: true,
      biometricEnabled: true,
      onboardingCompleted: false,
      onboardingStep: 1,
      selectedDocumentCategories: [],
      reminderPreferences: {
        documentExpiry: true,
        warrantyExpiry: true,
        insuranceRenewal: true,
        billPayment: true,
      },
      preferredLanguage: 'en',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return true;
  }
}
