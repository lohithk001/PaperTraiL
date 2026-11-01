import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StorageService } from './storage.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '@papertrail/types';
import { RequestPresignedUploadSchema } from '@papertrail/validators';

@ApiTags('Storage')
@ApiBearerAuth('clerk-auth')
@UseGuards(AuthGuard)
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload-url')
  @ApiOperation({ summary: 'Generate a short-lived presigned upload URL for Cloudflare R2' })
  async getPresignedUploadUrl(
    @CurrentUser() user: User,
    @Body() body: any,
  ) {
    const validated = RequestPresignedUploadSchema.parse(body);
    const data = await this.storageService.generatePresignedUploadUrl(
      user,
      validated.filename,
      validated.fileType,
      validated.fileSizeBytes,
    );
    return {
      success: true,
      data,
    };
  }

  @Get('info')
  @ApiOperation({ summary: 'Get current user storage quota, usage bytes, and limit' })
  getStorageInfo(@CurrentUser() user: User) {
    const info = this.storageService.getStorageInfo(user, 6);
    return {
      success: true,
      data: info,
    };
  }
}
