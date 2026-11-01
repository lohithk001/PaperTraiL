import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Connected to Neon PostgreSQL via Prisma');
    } catch (err) {
      console.warn('⚠️ Prisma connection warning (running in standalone/offline mode):', err);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
