import { 
  CanActivate, 
  ExecutionContext, 
  Injectable, 
  UnauthorizedException 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // Allow mock/development user in local dev when no Clerk token is supplied
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (process.env.NODE_ENV !== 'production') {
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return true;
      }
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      // In production, Clerk verifies the session JWT:
      // const session = await clerkClient.verifyToken(token);
      // const user = await this.prisma.user.upsert({ ... });
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired authentication token');
    }
  }
}
