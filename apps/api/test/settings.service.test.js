const { test } = require('node:test');
const assert = require('node:assert/strict');
const { SettingsService } = require('../src/settings/settings.service');

test('SettingsService.getSchoolSettings returns school data and settings', async () => {
  const prisma = {
    school: {
      findUnique: async () => ({
        id: 'school-1',
        name: 'Demo School',
        city: 'Warsaw',
        type: 'PUBLIC',
        settings: { riskGreenMax: 30, riskYellowMax: 60 },
      }),
    },
  };
  const service = new SettingsService(prisma);

  const result = await service.getSchoolSettings('school-1');

  assert.equal(result.id, 'school-1');
  assert.equal(result.settings.riskGreenMax, 30);
  assert.equal(result.settings.riskYellowMax, 60);
});

test('SettingsService.updateSchoolSettings validates risk thresholds', async () => {
  const prisma = {
    school: {
      findUnique: async () => ({
        id: 'school-1',
        name: 'Demo School',
        city: 'Warsaw',
        type: 'PUBLIC',
        settings: { riskGreenMax: 30, riskYellowMax: 60 },
      }),
      update: async () => ({}),
    },
    schoolSettings: {
      upsert: async () => ({}),
    },
  };
  const service = new SettingsService(prisma);

  await assert.rejects(
    () =>
      service.updateSchoolSettings('school-1', {
        riskGreenMax: 70,
        riskYellowMax: 60,
      }),
    /riskGreenMax must be less than riskYellowMax/,
  );
});
