const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  ParentIssueCategory,
  ParentIssuePriority,
  ParentIssueStatus,
} = require('@prisma/client');
const { ParentIssuesService } = require('../src/parent-issues/parent-issues.service');

test('ParentIssuesService.listIssues applies filters and pagination', async () => {
  const calls = {};
  const prisma = {
    parentIssue: {
      findMany: async (args) => {
        calls.findMany = args;
        return [];
      },
      count: async (args) => {
        calls.count = args;
        return 0;
      },
    },
    $transaction: async (ops) => Promise.all(ops),
  };
  const service = new ParentIssuesService(prisma);

  await service.listIssues({
    schoolId: 'school-1',
    status: ParentIssueStatus.NEW,
    priority: ParentIssuePriority.HIGH,
    classId: 'class-1',
    studentId: 'student-1',
    page: 2,
    pageSize: 5,
  });

  assert.equal(calls.findMany.where.schoolId, 'school-1');
  assert.equal(calls.findMany.where.status, ParentIssueStatus.NEW);
  assert.equal(calls.findMany.where.priority, ParentIssuePriority.HIGH);
  assert.equal(calls.findMany.where.studentId, 'student-1');
  assert.deepEqual(calls.findMany.where.student, { classId: 'class-1' });
  assert.equal(calls.findMany.skip, 5);
  assert.equal(calls.findMany.take, 5);
  assert.deepEqual(calls.count.where, calls.findMany.where);
});

test('ParentIssuesService.createIssue uses defaults and validates student scope', async () => {
  const calls = {};
  const prisma = {
    student: {
      findFirst: async (args) => {
        calls.studentFindFirst = args;
        return { id: 'student-1' };
      },
    },
    parentIssue: {
      create: async (args) => {
        calls.create = args;
        return { id: 'issue-1', ...args.data };
      },
    },
  };
  const service = new ParentIssuesService(prisma);

  await service.createIssue({
    schoolId: 'school-1',
    studentId: 'student-1',
    title: 'Need help',
  });

  assert.equal(calls.studentFindFirst.where.schoolId, 'school-1');
  assert.equal(calls.create.data.status, ParentIssueStatus.NEW);
  assert.equal(calls.create.data.category, ParentIssueCategory.OTHER);
  assert.equal(calls.create.data.priority, ParentIssuePriority.MEDIUM);
  assert.equal(calls.create.data.description, '');
});

test('ParentIssuesService.addComment creates a comment for the issue', async () => {
  const calls = {};
  const prisma = {
    parentIssue: {
      findFirst: async (args) => {
        calls.issueFind = args;
        return { id: 'issue-1' };
      },
    },
    parentIssueComment: {
      create: async (args) => {
        calls.commentCreate = args;
        return { id: 'comment-1', ...args.data };
      },
    },
  };
  const service = new ParentIssuesService(prisma);

  await service.addComment('issue-1', 'school-1', 'user-1', 'Thanks for the update');

  assert.equal(calls.issueFind.where.schoolId, 'school-1');
  assert.equal(calls.commentCreate.data.issueId, 'issue-1');
  assert.equal(calls.commentCreate.data.authorUserId, 'user-1');
  assert.equal(calls.commentCreate.data.comment, 'Thanks for the update');
});
