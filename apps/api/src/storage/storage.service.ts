import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageInfo, User } from '@papertrail/types';
import { PresignedUploadResponse } from '@papertrail/contracts';

@Injectable()
export class StorageService {
  private s3: S3Client;
  private bucketName: string;

  constructor() {
    const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID || 'mock_account_id';
    this.bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'papertrail-vault';

    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || 'mock_key',
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || 'mock_secret',
      },
    });
  }

  async generatePresignedUploadUrl(
    user: User,
    filename: string,
    fileType: string,
    fileSizeBytes: number,
  ): Promise<PresignedUploadResponse> {
    // Check remaining quota
    const remainingQuota = user.storageQuotaBytes - user.storageUsedBytes;
    if (fileSizeBytes > remainingQuota) {
      throw new BadRequestException('Storage quota exceeded. Please free up space or upgrade.');
    }

    const sanitizedExt = (filename.split('.').pop() || fileType).replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'bin';
    const uniqueKey = `users/${user.id}/docs/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${sanitizedExt}`;

    const mimeMap: Record<string, string> = {
      pdf: 'application/pdf',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
    };

    const contentType = mimeMap[fileType] || 'application/octet-stream';

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: uniqueKey,
        ContentType: contentType,
        ContentLength: fileSizeBytes,
        Metadata: {
          userId: user.id,
          originalName: filename,
        },
      });

      // 15-minute expiration
      const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 900 });

      return {
        uploadUrl,
        fileKey: uniqueKey,
        expiresAt: new Date(Date.now() + 900 * 1000).toISOString(),
        maxSizeBytes: fileSizeBytes,
      };
    } catch (e) {
      // In local dev without R2 credentials, return an authorized local mock endpoint
      return {
        uploadUrl: `http://localhost:8000/api/v1/storage/mock-upload/${uniqueKey}`,
        fileKey: uniqueKey,
        expiresAt: new Date(Date.now() + 900 * 1000).toISOString(),
        maxSizeBytes: fileSizeBytes,
      };
    }
  }

  async getPresignedDownloadUrl(fileKey: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });
      return await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    } catch {
      return `http://localhost:8000/api/v1/storage/mock-download/${fileKey}`;
    }
  }

  getStorageInfo(user: User, documentCount: number): StorageInfo {
    const usedMB = (user.storageUsedBytes / (1024 * 1024)).toFixed(1);
    const quotaMB = (user.storageQuotaBytes / (1024 * 1024)).toFixed(0);
    const percentage = Math.min(100, Math.round((user.storageUsedBytes / user.storageQuotaBytes) * 100));

    return {
      usedBytes: user.storageUsedBytes,
      quotaBytes: user.storageQuotaBytes,
      usedFormatted: `${usedMB} MB`,
      quotaFormatted: `${quotaMB} MB`,
      percentageUsed: percentage,
      documentCount,
    };
  }
}
