const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {
  ParentIssuePriority,
  ParentIssueStatus,
  RiskLevel,
  StudentActionPlanStatus,
} = require('@prisma/client');
const { ReportsService } = require('../src/reports/reports.service');

const shouldRun = process.env.REPORTS_PDF_INTEGRATION === '1';
const it = shouldRun ? test : test.skip;

it('ReportsService generates a real PDF when enabled', async () => {
  const prisma = {
    school: {
      findUnique: async () => ({ id: 'school-1', name: 'Test School' }),
    },
    student: {
      count: async () => 12,
    },
    riskScore: {
      groupBy: async () => [
        { level: RiskLevel.GREEN, _count: { _all: 5 } },
        { level: RiskLevel.RED, _count: { _all: 2 } },
      ],
    },
    parentIssue: {
      count: async () => 0,
      groupBy: async (args) => {
        if (args.by[0] === 'status') {
          return [{ status: ParentIssueStatus.NEW, _count: { _all: 4 } }];
        }
        return [{ priority: ParentIssuePriority.HIGH, _count: { _all: 2 } }];
      },
    },
    studentActionPlan: {
      count: async (args) => (args.where.status ? 2 : 5),
    },
    report: {
      create: async (args) => ({
        id: args.data.id,
        type: args.data.type,
        periodStart: args.data.periodStart,
        periodEnd: args.data.periodEnd,
        filePath: args.data.filePath,
        createdAt: new Date(),
      }),
    },
  };

  const storageRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'reports-pdf-test-'));
  process.env.REPORTS_STORAGE_ROOT = storageRoot;

  const service = new ReportsService(prisma);
  const periodStart = new Date('2024-01-01T00:00:00.000Z');
  const periodEnd = new Date('2024-01-31T23:59:59.000Z');

  const report = await service.generateMonthlyDirectorReport(
    'school-1',
    periodStart,
    periodEnd,
    'user-1',
  );

  const fullPath = path.join(storageRoot, report.filePath);
  const fileBuffer = fs.readFileSync(fullPath);
  assert.ok(fileBuffer.length > 0);
  assert.equal(fileBuffer.slice(0, 4).toString('utf8'), '%PDF');
});
