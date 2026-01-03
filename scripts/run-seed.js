#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');

const seedPath = path.resolve(__dirname, 'seed.ts');
const env = { ...process.env, TS_NODE_TRANSPILE_ONLY: '1' };

const result = spawnSync(
  process.execPath,
  ['-r', 'ts-node/register', '-r', 'tsconfig-paths/register', seedPath],
  { stdio: 'inherit', env },
);

if (result.error) {
  // eslint-disable-next-line no-console
  console.error(result.error);
}

process.exit(result.status ?? 1);
