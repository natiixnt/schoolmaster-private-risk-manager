import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ParentIssueStatus, RiskLevel, StudentActionPlanStatus } from '@prisma/client';

const TOP_LIMIT = 5;

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(schoolId: string) {
    const [
      studentsTotal,
      riskCounts,
      parentIssuesOpen,
      actionPlansOpen,
      topRiskStudentsRaw,
      classSummaries,
      lastRiskCalculated,
    ] = await Promise.all([
      this.prisma.student.count({ where: { schoolId } }),
      this.prisma.riskScore.groupBy({
        by: ['level'],
        _count: { _all: true },
        where: { student: { schoolId } },
      }),
      this.prisma.parentIssue.count({
        where: {
          schoolId,
          status: { notIn: [ParentIssueStatus.RESOLVED, ParentIssueStatus.CLOSED_NO_ACTION] },
        },
      }),
      this.prisma.studentActionPlan.count({
        where: {
          status: { in: [StudentActionPlanStatus.OPEN, StudentActionPlanStatus.IN_PROGRESS] },
          student: { schoolId },
        },
      }),
      this.prisma.riskScore.findMany({
        where: { student: { schoolId } },
        orderBy: [{ score: 'desc' }, { calculatedAt: 'desc' }],
        take: TOP_LIMIT,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              class: { select: { id: true, name: true, yearLevel: true } },
            },
          },
        },
      }),
      this.getClassRiskSummaries(schoolId),
      this.prisma.riskScore.aggregate({
        where: { student: { schoolId } },
        _max: { calculatedAt: true },
      }),
    ]);

    const risk = { green: 0, yellow: 0, red: 0 };
    for (const entry of riskCounts) {
      if (entry.level === RiskLevel.GREEN) risk.green = entry._count._all;
      if (entry.level === RiskLevel.YELLOW) risk.yellow = entry._count._all;
      if (entry.level === RiskLevel.RED) risk.red = entry._count._all;
    }

    const topRiskStudents = topRiskStudentsRaw.map((riskRow) => ({
      studentId: riskRow.studentId,
      firstName: riskRow.student.firstName,
      lastName: riskRow.student.lastName,
      class: riskRow.student.class
        ? {
            id: riskRow.student.class.id,
            name: riskRow.student.class.name,
            yearLevel: riskRow.student.class.yearLevel,
          }
        : null,
      score: riskRow.score,
      level: riskRow.level,
      calculatedAt: riskRow.calculatedAt,
    }));

    const topRiskClasses = [...classSummaries]
      .sort((a, b) => {
        if (b.riskRed !== a.riskRed) return b.riskRed - a.riskRed;
        if (b.riskYellow !== a.riskYellow) return b.riskYellow - a.riskYellow;
        return b.studentCount - a.studentCount;
      })
      .slice(0, TOP_LIMIT);

    return {
      studentsTotal,
      risk,
      parentIssues: { open: parentIssuesOpen },
      actionPlans: { open: actionPlansOpen },
      topRiskStudents,
      topRiskClasses,
      lastRiskRecalcAt: lastRiskCalculated._max.calculatedAt ?? null,
    };
  }

  private async getClassRiskSummaries(schoolId: string) {
    const classes = await this.prisma.class.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, yearLevel: true },
    });

    if (classes.length === 0) {
      return [];
    }

    const classIds = classes.map((cls) => cls.id);

    const [studentCounts, riskScores] = await Promise.all([
      this.prisma.student.groupBy({
        by: ['classId'],
        where: { schoolId, classId: { in: classIds } },
        _count: { _all: true },
      }),
      this.prisma.riskScore.findMany({
        where: {
          student: { schoolId, classId: { in: classIds } },
        },
        select: {
          level: true,
          student: { select: { classId: true } },
        },
      }),
    ]);

    const summaryByClass: Record<
      string,
      { studentCount: number; riskRed: number; riskYellow: number; riskGreen: number }
    > = {};

    classes.forEach((cls) => {
      summaryByClass[cls.id] = { studentCount: 0, riskRed: 0, riskYellow: 0, riskGreen: 0 };
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
    });

    return classes.map((cls) => {
      const summary = summaryByClass[cls.id];
      return {
        id: cls.id,
        name: cls.name,
        yearLevel: cls.yearLevel,
        level: cls.yearLevel !== null && cls.yearLevel !== undefined ? String(cls.yearLevel) : null,
        studentCount: summary?.studentCount ?? 0,
        riskRed: summary?.riskRed ?? 0,
        riskYellow: summary?.riskYellow ?? 0,
        riskGreen: summary?.riskGreen ?? 0,
      };
    });
  }
}
