import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User, ShareTokenItem } from '@papertrail/types';
import { CreateShareTokenSchema } from '@papertrail/validators';

@ApiTags('Document Sharing')
@ApiBearerAuth('clerk-auth')
@UseGuards(AuthGuard)
@Controller('share')
export class SharingController {
  private shares: ShareTokenItem[] = [];

  @Post()
  @ApiOperation({ summary: 'Generate a short-lived secure tokenized sharing link' })
  createShareLink(@CurrentUser() user: User, @Body() body: any) {
    const validated = CreateShareTokenSchema.parse(body);
    const token = `share_${Math.random().toString(36).substring(2, 12)}`;
    const expiresAt = new Date(Date.now() + validated.expiresInHours * 3600 * 1000).toISOString();

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

    this.shares.push(shareItem);
    return { success: true, data: shareItem };
  }

  @Get(':token')
  @ApiOperation({ summary: 'Resolve a shared document using its public token' })
  resolveShare(@Param('token') token: string) {
    const share = this.shares.find((s) => s.token === token && !s.isRevoked);
    if (!share || new Date(share.expiresAt).getTime() < Date.now()) {
      return { success: false, message: 'Share link expired or invalid' };
    }
    share.accessCount += 1;
    return { success: true, data: share };
  }
}
