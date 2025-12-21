import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ParentIssueStatus, RiskLevel, StudentActionPlanStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(schoolId: string) {
    const [studentsTotal, riskCounts, parentIssuesOpen, actionPlansOpen] = await Promise.all([
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
    ]);

    const risk = { green: 0, yellow: 0, red: 0 };
    for (const entry of riskCounts) {
      if (entry.level === RiskLevel.GREEN) risk.green = entry._count._all;
      if (entry.level === RiskLevel.YELLOW) risk.yellow = entry._count._all;
      if (entry.level === RiskLevel.RED) risk.red = entry._count._all;
    }

    return {
      studentsTotal,
      risk,
      parentIssues: { open: parentIssuesOpen },
      actionPlans: { open: actionPlansOpen },
    };
  }
}
