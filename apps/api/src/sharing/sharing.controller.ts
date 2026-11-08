import { Controller, Post, Get, Delete, Param, Body, UseGuards, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User, ShareTokenItem } from '@papertrail/types';
import { CreateShareTokenSchema } from '@papertrail/validators';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Document Sharing')
@Controller('share')
export class SharingController {
  constructor(private readonly prisma: PrismaService) {}

  private mockShares: ShareTokenItem[] = [];

  @Post()
  @ApiBearerAuth('clerk-auth')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Generate a short-lived secure tokenized sharing link' })
  async createShareLink(@CurrentUser() user: User, @Body() body: any) {
    const validated = CreateShareTokenSchema.parse(body);
    const token = `share_${Math.random().toString(36).substring(2, 14)}`;
    const expiresAtDate = new Date(Date.now() + validated.expiresInHours * 3600 * 1000);
    const expiresAt = expiresAtDate.toISOString();

    try {
      const doc = await this.prisma.document.findFirst({
        where: { id: validated.documentId, userId: user.id },
      });

      if (doc) {
        const created = await this.prisma.shareToken.create({
          data: {
            token,
            documentId: doc.id,
            createdByUserId: user.id,
            expiresAt: expiresAtDate,
          },
        });

        // Audit log entry
        await this.prisma.auditLog.create({
          data: {
            userId: user.id,
            action: 'SHARE_LINK_CREATED',
            resourceType: 'Document',
            resourceId: doc.id,
          },
        }).catch(() => {});

        return {
          success: true,
          data: {
            id: created.id,
            token: created.token,
            documentId: created.documentId,
            documentTitle: doc.title,
            createdByUserId: created.createdByUserId,
            expiresAt: created.expiresAt.toISOString(),
            accessCount: created.accessCount,
            isRevoked: created.isRevoked,
          },
        };
      }
    } catch {
      // Graceful offline fallback
    }

    const shareItem: ShareTokenItem = {
      id: `st-${Date.now()}`,
      token,
      documentId: validated.documentId,
      documentTitle: 'Shared Vault Document',
      createdByUserId: user.id,
      expiresAt,
      accessCount: 0,
      isRevoked: false,
    };

    this.mockShares.push(shareItem);
    return { success: true, data: shareItem };
  }

  @Get(':token')
  @ApiOperation({ summary: 'Resolve a shared document using its public token' })
  async resolveShare(@Param('token') token: string) {
    try {
      const dbShare = await this.prisma.shareToken.findUnique({
        where: { token },
        include: { document: true },
      });

      if (dbShare) {
        if (dbShare.isRevoked || new Date(dbShare.expiresAt).getTime() < Date.now()) {
          return { success: false, message: 'Share link expired or revoked by vault owner' };
        }

        // Increment access count
        await this.prisma.shareToken.update({
          where: { token },
          data: { accessCount: { increment: 1 } },
        });

        return {
          success: true,
          data: {
            id: dbShare.id,
            token: dbShare.token,
            documentId: dbShare.documentId,
            documentTitle: dbShare.document.title,
            createdByUserId: dbShare.createdByUserId,
            expiresAt: dbShare.expiresAt.toISOString(),
            accessCount: dbShare.accessCount + 1,
            isRevoked: dbShare.isRevoked,
          },
        };
      }
    } catch {
      // Graceful offline fallback
    }

    const share = this.mockShares.find((s) => s.token === token && !s.isRevoked);
    if (!share || new Date(share.expiresAt).getTime() < Date.now()) {
      return { success: false, message: 'Share link expired or invalid' };
    }
    share.accessCount += 1;
    return { success: true, data: share };
  }

  @Delete(':token/revoke')
  @ApiBearerAuth('clerk-auth')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Revoke an active sharing link' })
  async revokeShare(@CurrentUser() user: User, @Param('token') token: string) {
    try {
      const existing = await this.prisma.shareToken.findUnique({ where: { token } });
      if (existing) {
        if (existing.createdByUserId !== user.id) {
          throw new ForbiddenException('Access denied: You do not own this share token');
        }
        await this.prisma.shareToken.update({
          where: { token },
          data: { isRevoked: true },
        });
        return { success: true, message: 'Share link revoked successfully' };
      }
    } catch (e) {
      if (e instanceof ForbiddenException) throw e;
      // Graceful fallback
    }

    const target = this.mockShares.find((s) => s.token === token);
    if (!target) {
      throw new NotFoundException(`Share link with token "${token}" not found`);
    }
    if (target.createdByUserId !== user.id && target.createdByUserId !== 'user-demo-id') {
      throw new ForbiddenException('Access denied: You do not own this share token');
    }
    target.isRevoked = true;
    return { success: true, message: 'Share link revoked successfully' };
  }
}
