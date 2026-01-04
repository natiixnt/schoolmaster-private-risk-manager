import { Injectable, NotFoundException } from '@nestjs/common';
import { RiskLevel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  async listClasses(schoolId: string) {
    return this.prisma.class.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        yearLevel: true,
        homeroomTeacherId: true,
      },
    });
  }

  async listClassSummaries(schoolId: string, classId?: string) {
    const classes = await this.prisma.class.findMany({
      where: {
        schoolId,
        id: classId ?? undefined,
      },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        yearLevel: true,
        homeroomTeacherId: true,
      },
    });

    if (classes.length === 0) {
      return [];
    }

    const classIds = classes.map((cls) => cls.id);

    const [studentCounts, riskScores] = await Promise.all([
      this.prisma.student.groupBy({
        by: ['classId'],
        where: {
          schoolId,
          classId: { in: classIds },
        },
        _count: { _all: true },
      }),
      this.prisma.riskScore.findMany({
        where: {
          student: {
            schoolId,
            classId: { in: classIds },
          },
        },
        select: {
          level: true,
          calculatedAt: true,
          student: { select: { classId: true } },
        },
      }),
    ]);

    const summaryByClass: Record<
      string,
      {
        studentCount: number;
        riskRed: number;
        riskYellow: number;
        riskGreen: number;
        lastCalculatedAt: Date | null;
      }
    > = {};

    classes.forEach((cls) => {
      summaryByClass[cls.id] = {
        studentCount: 0,
        riskRed: 0,
        riskYellow: 0,
        riskGreen: 0,
        lastCalculatedAt: null,
      };
    });

    studentCounts.forEach((row) => {
      if (summaryByClass[row.classId]) {
        summaryByClass[row.classId].studentCount = row._count._all;
      }
    });

    riskScores.forEach((risk) => {
      const classKey = risk.student.classId;
      const bucket = summaryByClass[classKey];
      if (!bucket) return;
      if (risk.level === RiskLevel.RED) bucket.riskRed += 1;
      if (risk.level === RiskLevel.YELLOW) bucket.riskYellow += 1;
      if (risk.level === RiskLevel.GREEN) bucket.riskGreen += 1;
      if (!bucket.lastCalculatedAt || risk.calculatedAt > bucket.lastCalculatedAt) {
        bucket.lastCalculatedAt = risk.calculatedAt;
      }
    });

    return classes.map((cls) => {
      const summary = summaryByClass[cls.id];
      return {
        id: cls.id,
        name: cls.name,
        yearLevel: cls.yearLevel,
        level: cls.yearLevel !== null && cls.yearLevel !== undefined ? String(cls.yearLevel) : null,
        homeroomTeacherId: cls.homeroomTeacherId,
        studentCount: summary?.studentCount ?? 0,
        riskRed: summary?.riskRed ?? 0,
        riskYellow: summary?.riskYellow ?? 0,
        riskGreen: summary?.riskGreen ?? 0,
        lastCalculatedAt: summary?.lastCalculatedAt ?? null,
      };
    });
  }

  async getClassSummary(schoolId: string, classId: string) {
    const summaries = await this.listClassSummaries(schoolId, classId);
    if (!summaries.length) {
      throw new NotFoundException('Class not found');
    }
    return summaries[0];
  }

  async getClassOrThrow(schoolId: string, id: string) {
    const cls = await this.prisma.class.findFirst({ where: { id, schoolId } });
    if (!cls) {
      throw new NotFoundException('Class not found');
    }
    return cls;
  }

  async getOrCreateByName(schoolId: string, name: string) {
    const existing = await this.prisma.class.findFirst({ where: { schoolId, name } });
    if (existing) {
      return { record: existing, created: false };
    }
    const created = await this.prisma.class.create({ data: { schoolId, name } });
    return { record: created, created: true };
  }
}
