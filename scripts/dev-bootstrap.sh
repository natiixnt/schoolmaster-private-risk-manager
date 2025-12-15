#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> Starting Postgres (docker compose)..."
npm run db:up

echo "==> Waiting for Postgres to accept connections on localhost:5432..."
for i in {1..30}; do
  if node -e "const net=require('net');const s=net.connect({host:'127.0.0.1',port:5432},()=>{s.end();});s.on('error',()=>process.exit(1));s.on('close',()=>process.exit(0));" >/dev/null 2>&1; then
    echo "Postgres is up."
    break
  fi
  if [[ $i -eq 30 ]]; then
    echo "Postgres did not become ready in time." >&2
    exit 1
  fi
  sleep 1
done

echo "==> Running database migrations..."
npm run db:migrate

echo "==> Seeding database..."
npm run db:seed

echo "==> Starting dev apps (API + web)..."
npm run dev:apps
