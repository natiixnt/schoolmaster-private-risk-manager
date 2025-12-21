import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ParentIssuePriority,
  ParentIssueStatus,
  ReportType,
  RiskLevel,
  StudentActionPlanStatus,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import { createWriteStream, promises as fs } from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

const MAX_PERIOD_DAYS = 366;

const getStorageRoot = () =>
  process.env.REPORTS_STORAGE_ROOT ?? path.join(process.cwd(), 'storage');

const formatDate = (value: Date) => value.toISOString().slice(0, 10);

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateReport(params: {
    schoolId: string;
    type: ReportType;
    periodStart: Date;
    periodEnd: Date;
    userId?: string;
  }) {
    if (params.type !== ReportType.MONTHLY_DIRECTOR) {
      throw new BadRequestException('Report type not supported yet');
    }

    return this.generateMonthlyDirectorReport(
      params.schoolId,
      params.periodStart,
      params.periodEnd,
      params.userId,
    );
  }

  async generateMonthlyDirectorReport(
    schoolId: string,
    periodStart: Date,
    periodEnd: Date,
    userId?: string,
  ) {
    if (periodStart > periodEnd) {
      throw new BadRequestException('periodStart must be before periodEnd');
    }

    const diffDays = Math.ceil((periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > MAX_PERIOD_DAYS) {
      throw new BadRequestException('Report period is too long');
    }

    const school = await this.prisma.school.findUnique({ where: { id: schoolId } });
    if (!school) {
      throw new NotFoundException('School not found');
    }

    this.logger.log(
      `Generating report ${ReportType.MONTHLY_DIRECTOR} for school ${schoolId} (${formatDate(periodStart)} - ${formatDate(periodEnd)})`,
    );

    const [
      totalStudents,
      riskDistributionRaw,
      issuesCreated,
      issuesResolved,
      issueStatusRaw,
      issuePriorityRaw,
      activePlans,
      plansCreated,
    ] = await Promise.all([
      this.prisma.student.count({ where: { schoolId } }),
      this.prisma.riskScore.groupBy({
        by: ['level'],
        where: { student: { schoolId } },
        _count: { _all: true },
      }),
      this.prisma.parentIssue.count({
        where: {
          schoolId,
          createdAt: { gte: periodStart, lte: periodEnd },
        },
      }),
      this.prisma.parentIssue.count({
        where: {
          schoolId,
          status: ParentIssueStatus.RESOLVED,
          closedAt: { gte: periodStart, lte: periodEnd },
        },
      }),
      this.prisma.parentIssue.groupBy({
        by: ['status'],
        where: {
          schoolId,
          createdAt: { gte: periodStart, lte: periodEnd },
        },
        _count: { _all: true },
      }),
      this.prisma.parentIssue.groupBy({
        by: ['priority'],
        where: {
          schoolId,
          createdAt: { gte: periodStart, lte: periodEnd },
        },
        _count: { _all: true },
      }),
      this.prisma.studentActionPlan.count({
        where: {
          status: { in: [StudentActionPlanStatus.OPEN, StudentActionPlanStatus.IN_PROGRESS] },
          student: { schoolId },
        },
      }),
      this.prisma.studentActionPlan.count({
        where: {
          createdAt: { gte: periodStart, lte: periodEnd },
          student: { schoolId },
        },
      }),
    ]);

    const riskDistribution = Object.values(RiskLevel).reduce<Record<RiskLevel, number>>(
      (acc, level) => {
        acc[level] = 0;
        return acc;
      },
      {} as Record<RiskLevel, number>,
    );

    riskDistributionRaw.forEach((row) => {
      riskDistribution[row.level] = row._count._all;
    });

    const issueStatus = Object.values(ParentIssueStatus).reduce<Record<ParentIssueStatus, number>>(
      (acc, status) => {
        acc[status] = 0;
        return acc;
      },
      {} as Record<ParentIssueStatus, number>,
    );
    issueStatusRaw.forEach((row) => {
      issueStatus[row.status] = row._count._all;
    });

    const issuePriority = Object.values(ParentIssuePriority).reduce<Record<ParentIssuePriority, number>>(
      (acc, priority) => {
        acc[priority] = 0;
        return acc;
      },
      {} as Record<ParentIssuePriority, number>,
    );
    issuePriorityRaw.forEach((row) => {
      issuePriority[row.priority] = row._count._all;
    });

    const reportId = randomUUID();
    const filePath = path.posix.join('reports', schoolId, `${reportId}.pdf`);
    const fullPath = path.join(getStorageRoot(), filePath);

    await fs.mkdir(path.dirname(fullPath), { recursive: true });

    await this.writeMonthlyDirectorPdf(fullPath, {
      schoolName: school.name,
      periodStart,
      periodEnd,
      totalStudents,
      riskDistribution,
      issuesCreated,
      issuesResolved,
      issueStatus,
      issuePriority,
      activePlans,
      plansCreated,
    });

    const report = await this.prisma.report.create({
      data: {
        id: reportId,
        schoolId,
        type: ReportType.MONTHLY_DIRECTOR,
        periodStart,
        periodEnd,
        filePath,
        createdByUserId: userId ?? null,
      },
    });

    this.logger.log(
      `Report ${report.id} generated for school ${schoolId} (${formatDate(periodStart)} - ${formatDate(periodEnd)})`,
    );

    return report;
  }

  async listReports(params: {
    schoolId: string;
    type?: ReportType;
    page?: number;
    pageSize?: number;
  }) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : 20;
    const skip = (page - 1) * pageSize;

    const where = {
      schoolId: params.schoolId,
      type: params.type,
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.report.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
        select: {
          id: true,
          type: true,
          periodStart: true,
          periodEnd: true,
          createdAt: true,
        },
      }),
      this.prisma.report.count({ where }),
    ]);

    return {
      total,
      page,
      pageSize,
      items,
    };
  }

  async getReportDownload(reportId: string, schoolId: string) {
    const report = await this.prisma.report.findFirst({
      where: { id: reportId, schoolId },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    const fullPath = path.join(getStorageRoot(), report.filePath);
    try {
      await fs.access(fullPath);
    } catch (error) {
      throw new NotFoundException('Report file not found');
    }

    return { report, fullPath };
  }

  private async writeMonthlyDirectorPdf(
    fullPath: string,
    data: {
      schoolName: string;
      periodStart: Date;
      periodEnd: Date;
      totalStudents: number;
      riskDistribution: Record<RiskLevel, number>;
      issuesCreated: number;
      issuesResolved: number;
      issueStatus: Record<ParentIssueStatus, number>;
      issuePriority: Record<ParentIssuePriority, number>;
      activePlans: number;
      plansCreated: number;
    },
  ) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const stream = createWriteStream(fullPath);

    doc.pipe(stream);

    doc.fontSize(20).text(`Raport miesieczny - ${data.schoolName}`, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Okres: ${formatDate(data.periodStart)} - ${formatDate(data.periodEnd)}`);
    doc.moveDown();

    doc.fontSize(16).text('Uczniowie ryzyka');
    doc.fontSize(12).text(`Liczba uczniow: ${data.totalStudents}`);
    doc.text(`GREEN: ${data.riskDistribution[RiskLevel.GREEN]}`);
    doc.text(`YELLOW: ${data.riskDistribution[RiskLevel.YELLOW]}`);
    doc.text(`RED: ${data.riskDistribution[RiskLevel.RED]}`);
    doc.moveDown();

    doc.fontSize(16).text('Sprawy rodzicow');
    doc.fontSize(12).text(`Nowe sprawy w okresie: ${data.issuesCreated}`);
    doc.text(`Rozwiazane sprawy w okresie: ${data.issuesResolved}`);
    doc.moveDown(0.5);
    doc.text('Statusy:');
    Object.entries(data.issueStatus).forEach(([status, count]) => {
      doc.text(`${status}: ${count}`);
    });
    doc.moveDown(0.5);
    doc.text('Priorytety:');
    Object.entries(data.issuePriority).forEach(([priority, count]) => {
      doc.text(`${priority}: ${count}`);
    });
    doc.moveDown();

    doc.fontSize(16).text('Plany dzialan');
    doc.fontSize(12).text(`Aktywne plany: ${data.activePlans}`);
    doc.text(`Nowe plany w okresie: ${data.plansCreated}`);

    await new Promise<void>((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
      doc.on('error', reject);
      doc.end();
    });
  }
}
