const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  StudentActionItemStatus,
  StudentActionPlanStatus,
} = require('@prisma/client');
const { ActionPlansService } = require('../src/action-plans/action-plans.service');

test('ActionPlansService.createPlan sets defaults and uses creator', async () => {
  const calls = {};
  const prisma = {
    student: {
      findFirst: async (args) => {
        calls.studentFindFirst = args;
        return { id: 'student-1' };
      },
    },
    studentActionPlan: {
      create: async (args) => {
        calls.planCreate = args;
        return { id: 'plan-1', ...args.data };
      },
    },
  };
  const service = new ActionPlansService(prisma);

  await service.createPlan('student-1', 'school-1', 'user-1', { goal: 'Improve focus' });

  assert.equal(calls.studentFindFirst.where.schoolId, 'school-1');
  assert.equal(calls.planCreate.data.createdByUserId, 'user-1');
  assert.equal(calls.planCreate.data.status, StudentActionPlanStatus.OPEN);
});

test('ActionPlansService.addItem defaults owner and normalizes dueDate', async () => {
  const calls = {};
  const prisma = {
    studentActionPlan: {
      findFirst: async (args) => {
        calls.planFind = args;
        return { id: 'plan-1' };
      },
    },
    user: {
      findFirst: async (args) => {
        calls.ownerFind = args;
        return { id: 'user-1' };
      },
    },
    studentActionItem: {
      create: async (args) => {
        calls.itemCreate = args;
        return { id: 'item-1', ...args.data };
      },
    },
  };
  const service = new ActionPlansService(prisma);

  await service.addItem('plan-1', 'school-1', 'user-1', {
    description: 'Call guardian',
    dueDate: '2030-01-01',
  });

  assert.equal(calls.planFind.where.student.schoolId, 'school-1');
  assert.equal(calls.ownerFind.where.id, 'user-1');
  assert.equal(calls.itemCreate.data.ownerUserId, 'user-1');
  assert.ok(calls.itemCreate.data.dueDate instanceof Date);
});

test('ActionPlansService.updatePlan updates status while keeping goal', async () => {
  const calls = {};
  const prisma = {
    studentActionPlan: {
      findFirst: async () => ({
        id: 'plan-1',
        goal: 'Keep homework on track',
        status: StudentActionPlanStatus.OPEN,
      }),
      update: async (args) => {
        calls.planUpdate = args;
        return { id: 'plan-1', ...args.data };
      },
    },
  };
  const service = new ActionPlansService(prisma);

  await service.updatePlan('plan-1', 'school-1', {
    status: StudentActionPlanStatus.IN_PROGRESS,
  });

  assert.equal(calls.planUpdate.data.status, StudentActionPlanStatus.IN_PROGRESS);
  assert.equal(calls.planUpdate.data.goal, 'Keep homework on track');
});
