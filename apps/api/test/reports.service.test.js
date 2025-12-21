const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {
  ParentIssuePriority,
  ParentIssueStatus,
  ReportType,
  RiskLevel,
  StudentActionPlanStatus,
} = require('@prisma/client');
const { ReportsService } = require('../src/reports/reports.service');

test('ReportsService.generateMonthlyDirectorReport aggregates data and writes file', async () => {
  const calls = {};
  const prisma = {
    school: {
      findUnique: async (args) => {
        calls.schoolFindUnique = args;
        return { id: 'school-1', name: 'Test School' };
      },
    },
    student: {
      count: async (args) => {
        calls.studentCount = args;
        return 12;
      },
    },
    riskScore: {
      groupBy: async (args) => {
        calls.riskGroupBy = args;
        return [
          { level: RiskLevel.GREEN, _count: { _all: 5 } },
          { level: RiskLevel.RED, _count: { _all: 2 } },
        ];
      },
    },
    parentIssue: {
      count: async (args) => {
        calls.issueCounts = calls.issueCounts || [];
        calls.issueCounts.push(args);
        return args.where.status === ParentIssueStatus.RESOLVED ? 3 : 7;
      },
      groupBy: async (args) => {
        if (args.by[0] === 'status') {
          calls.issueGroupByStatus = args;
          return [{ status: ParentIssueStatus.NEW, _count: { _all: 4 } }];
        }
        calls.issueGroupByPriority = args;
        return [{ priority: ParentIssuePriority.HIGH, _count: { _all: 2 } }];
      },
    },
    studentActionPlan: {
      count: async (args) => {
        calls.planCounts = calls.planCounts || [];
        calls.planCounts.push(args);
        return args.where.status ? 2 : 5;
      },
    },
    report: {
      create: async (args) => {
        calls.reportCreate = args;
        return {
          id: args.data.id,
          type: args.data.type,
          periodStart: args.data.periodStart,
          periodEnd: args.data.periodEnd,
          filePath: args.data.filePath,
          createdAt: new Date(),
        };
      },
    },
  };

  const storageRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'reports-test-'));
  process.env.REPORTS_STORAGE_ROOT = storageRoot;

  const service = new ReportsService(prisma);
  service.writeMonthlyDirectorPdf = async (fullPath) => {
    fs.writeFileSync(fullPath, 'test');
  };
  const periodStart = new Date('2024-01-01T00:00:00.000Z');
  const periodEnd = new Date('2024-01-31T23:59:59.000Z');

  const report = await service.generateMonthlyDirectorReport(
    'school-1',
    periodStart,
    periodEnd,
    'user-1',
  );

  const fullPath = path.join(storageRoot, report.filePath);
  assert.equal(report.type, ReportType.MONTHLY_DIRECTOR);
  assert.ok(fs.existsSync(fullPath));
  assert.ok(fs.statSync(fullPath).size > 0);
  assert.equal(calls.reportCreate.data.createdByUserId, 'user-1');
  assert.equal(calls.riskGroupBy.where.student.schoolId, 'school-1');
  assert.equal(
    calls.issueGroupByStatus.where.createdAt.gte.getTime(),
    periodStart.getTime(),
  );
  assert.equal(
    calls.issueGroupByStatus.where.createdAt.lte.getTime(),
    periodEnd.getTime(),
  );
  assert.deepEqual(calls.planCounts[0].where.status, {
    in: [StudentActionPlanStatus.OPEN, StudentActionPlanStatus.IN_PROGRESS],
  });
});

test('ReportsService.getReportDownload throws when report is missing', async () => {
  const prisma = {
    report: {
      findFirst: async () => null,
    },
  };
  const service = new ReportsService(prisma);

  await assert.rejects(() => service.getReportDownload('report-1', 'school-1'), /Report not found/);
});
