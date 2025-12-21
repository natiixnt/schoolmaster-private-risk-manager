import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HealthResponse } from '@schoolmaster/core';

const VERSION = process.env.npm_package_version ?? '0.1.0';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async check(): Promise<HealthResponse> {
    const dbHealthy = await this.prisma.isHealthy();
    return {
      status: 'ok',
      db: dbHealthy ? 'ok' : 'error',
      uptimeSeconds: Math.floor(process.uptime()),
      version: VERSION,
      timestamp: new Date().toISOString(),
    };
  }
}
