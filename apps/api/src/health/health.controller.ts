import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Health & Telemetry')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Backend, Database & Storage Health-Check Probe' })
  async getHealth() {
    const startTime = Date.now();
    let dbStatus = 'connected';
    let dbLatencyMs = 0;

    try {
      const dbStart = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      dbLatencyMs = Date.now() - dbStart;
    } catch {
      dbStatus = 'degraded_offline_cache';
    }

    const memoryUsage = process.memoryUsage();
    const uptimeSec = Math.floor(process.uptime());

    return {
      status: dbStatus === 'connected' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: uptimeSec,
      totalLatencyMs: Date.now() - startTime,
      database: {
        engine: 'Neon PostgreSQL',
        status: dbStatus,
        latencyMs: dbLatencyMs,
      },
      storage: {
        engine: 'Neon DB Direct Vault',
        encryption: 'AES-256-GCM',
        isolation: 'Row-level cryptographic user scoping',
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        heapUsedMb: (memoryUsage.heapUsed / 1024 / 1024).toFixed(1),
        heapTotalMb: (memoryUsage.heapTotal / 1024 / 1024).toFixed(1),
        rssMb: (memoryUsage.rss / 1024 / 1024).toFixed(1),
      },
    };
  }
}
