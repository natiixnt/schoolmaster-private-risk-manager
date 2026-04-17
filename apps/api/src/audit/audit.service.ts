import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface AuditOptions {
  schoolId?: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(opts: AuditOptions) {
    return this.prisma.auditLog.create({
      data: {
        schoolId: opts.schoolId,
        userId: opts.userId,
        action: opts.action,
        entityType: opts.entityType,
        entityId: opts.entityId,
        details: opts.details as any,
        ipAddress: opts.ipAddress,
      },
    });
  }
}
