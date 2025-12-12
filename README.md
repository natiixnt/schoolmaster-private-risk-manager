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
2. **Start Postgres**
   ```bash
   docker compose -f infra/docker/docker-compose.dev.yml up -d postgres
   ```
3. **Configure envs**
   - Copy `apps/api/.env.example` to `apps/api/.env` and adjust if needed.
   - Copy `apps/web/.env.example` to `apps/web/.env`.
4. **Run migrations + seed**
   ```bash
   # run from repo root
   DATABASE_URL=postgresql://schoolmaster:schoolmaster@localhost:5432/schoolmaster \
   npm run --workspace @schoolmaster/api prisma:migrate

   DATABASE_URL=postgresql://schoolmaster:schoolmaster@localhost:5432/schoolmaster \
   npm run --workspace @schoolmaster/api seed
   ```
5. **Start dev servers** (API on :3001, web on :3000)
   ```bash
   npx turbo run dev
   ```
6. **Smoke test**
   - API health: http://localhost:3001/health
   - Frontend: http://localhost:3000 (shows health call result)
   - Login: http://localhost:3000/auth/login (seeded admin user: `admin@schoolmaster.test` / `changeme`)
   - Dev tools: http://localhost:3000/dev/tools (CSV upload + classes/students fetch)

## Scripts (root)
- `npm run dev` – turbo run dev across apps
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
- Import (JWT + role SCHOOL_ADMIN/DIRECTOR): `POST /import/students` (CSV columns: class_name, first_name, last_name, external_id)

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
