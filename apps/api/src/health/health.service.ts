import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HealthResponse } from '@schoolmaster/core';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async check(): Promise<HealthResponse> {
    const dbHealthy = await this.prisma.isHealthy();
    return {
      status: 'ok',
      db: dbHealthy ? 'ok' : 'error',
    };
  }
}
