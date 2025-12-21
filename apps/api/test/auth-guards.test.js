const { test } = require('node:test');
const assert = require('node:assert/strict');
const { JwtAuthGuard } = require('../src/common/guards/jwt-auth.guard');
const { RolesGuard } = require('../src/common/guards/roles.guard');
const { UserRole } = require('@schoolmaster/core');

test('JwtAuthGuard rejects missing user', () => {
  const guard = new JwtAuthGuard();
  assert.throws(
    () => guard.handleRequest(null, null, { message: 'No token' }, null),
    /Unauthorized/,
  );
});

test('RolesGuard rejects insufficient role', () => {
  const reflector = {
    getAllAndOverride: () => [UserRole.DIRECTOR],
  };
  const guard = new RolesGuard(reflector);
  const context = {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({ user: { role: UserRole.TEACHER } }),
    }),
  };

  assert.throws(() => guard.canActivate(context), /Insufficient role/);
});
