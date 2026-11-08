import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';
import { DocumentsModule } from './documents/documents.module';
import { RemindersModule } from './reminders/reminders.module';
import { OcrModule } from './ocr/ocr.module';
import { CryptoModule } from './crypto/crypto.module';
import { HealthModule } from './health/health.module';
import { FoldersController } from './folders/folders.controller';
import { NotificationsController } from './notifications/notifications.controller';
import { SharingController } from './sharing/sharing.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 120, // rate limiting
      },
    ]),
    PrismaModule,
    CryptoModule,
    HealthModule,
    AuthModule,
    StorageModule,
    DocumentsModule,
    RemindersModule,
    OcrModule,
  ],
  controllers: [
    FoldersController,
    NotificationsController,
    SharingController,
  ],
})
export class AppModule {}
