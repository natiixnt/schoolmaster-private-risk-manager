# Schoolmaster Monorepo

Monorepo for the Schoolmaster backend (NestJS + Prisma) and minimal dev frontend (Next.js). Turborepo orchestrates tasks, Postgres runs via docker-compose.

## Stack
- Node 20+, npm workspaces + Turborepo
- Backend: NestJS, Prisma, PostgreSQL
- Frontend: Next.js (app router) for smoke/dev tools only

## Getting started
1. **Install deps** (from repo root)
   ```bash
   npm install
   ```
2. **Configure envs**
   ```bash
   cp .env.example .env
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```
   API JWT envs live in `apps/api/.env` (JWT_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN).
3. **Start everything (db + migrations + seed + dev servers)**
   ```bash
   npm run dev:bootstrap
   ```
   This will start Postgres (docker), apply Prisma migrations, seed demo data, and start API + web via Turbo.

Manual alternative:
- Start Postgres: `npm run db:up`
- Migrate: `npm run db:migrate`
- Seed: `npm run db:seed`
- Dev servers: `npm run dev:apps`
4. **Smoke test**
   - API health: http://localhost:3001/health
   - Frontend: http://localhost:3000 (shows health call result)
   - Login: http://localhost:3000/auth/login (seeded admin user: `admin@schoolmaster.test` / `changeme`)
   - Dev tools: http://localhost:3000/dev/tools (CSV upload + classes/students fetch)

## Scripts (root)
- `npm run dev:bootstrap` – start Postgres, migrate, seed, and run dev servers (fast path, API ready in seconds after Postgres is up)
- `npm run dev:apps` – turbo run dev across apps (API + web) without db bootstrap
- `npm run db:up` – start Postgres via docker-compose.dev.yml
- `npm run db:migrate` – apply Prisma migrations for API (uses `.env` for DATABASE_URL)
- `npm run db:seed` – seed demo data (idempotent)
- `npm run dev` – alias of `dev:apps`
- `npm run build` – turbo build
- `npm run lint` – turbo lint
- `npm run seed` – seeds via API workspace

## Backend (apps/api)
- NestJS app on port 3001 (configurable via `PORT`).
- Health: `GET /health` returns API + DB status.
- Auth:
  - `POST /auth/login` (email/password) → access + refresh token
  - `POST /auth/refresh` → new token pair
  - `GET /auth/me` (JWT required)
- Users (JWT + role SCHOOL_ADMIN/DIRECTOR): `GET /users`, `POST /users`, `PATCH /users/:id`
- Classes & students (JWT): `GET /classes`, `GET /classes/:id/students`
- Import (JWT required): `POST /import/students` (CSV columns: class_name, first_name, last_name, external_id)

## Frontend (apps/web)
Minimal app router pages for dev/testing only:
- `/` – health check display
- `/auth/login` – login form, stores tokens in `localStorage`
- `/dev/tools` – upload students CSV, list classes, and fetch students per class

## Docker
- `infra/docker/docker-compose.dev.yml` starts Postgres with default creds `schoolmaster/schoolmaster` and DB `schoolmaster` on port 5432.
- Optional API Dockerfile: `infra/docker/Dockerfile.api` (simple build skeleton).

## Notes
- Shared configs live in `packages/config`; shared types in `packages/core`.
- Prisma schema & migrations reside in `apps/api/prisma/`.
