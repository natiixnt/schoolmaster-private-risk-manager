#!/usr/bin/env node
/**
 * Small helper to wait until the Postgres port is accepting connections.
 * Parses DATABASE_URL if present; otherwise defaults to localhost:5432.
 */
const net = require('net');

const urlString = process.env.DATABASE_URL;
let host = '127.0.0.1';
let port = 5432;

if (urlString) {
  try {
    const parsed = new URL(urlString);
    host = parsed.hostname || host;
    port = parsed.port ? Number(parsed.port) : port;
  } catch (err) {
    // fall back to defaults if parsing fails
    // eslint-disable-next-line no-console
    console.warn('Could not parse DATABASE_URL, falling back to localhost:5432');
  }
}

const maxAttempts = 30;
let attempts = 0;

function check() {
  return new Promise((resolve) => {
    const socket = net.connect({ host, port }, () => {
      socket.end();
      resolve(true);
    });
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.setTimeout(1000, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

(async () => {
  // eslint-disable-next-line no-console
  console.log(`Waiting for Postgres at ${host}:${port}...`);
  while (attempts < maxAttempts) {
    // eslint-disable-next-line no-await-in-loop
    const ok = await check();
    if (ok) {
      // eslint-disable-next-line no-console
      console.log('Postgres is reachable.');
      process.exit(0);
    }
    attempts += 1;
    // eslint-disable-next-line no-console
    console.log(`Not ready yet, retrying (${attempts}/${maxAttempts})...`);
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => setTimeout(r, 500));
  }
  // eslint-disable-next-line no-console
  console.error(`Postgres not reachable after ${maxAttempts} attempts.`);
  process.exit(1);
})();
