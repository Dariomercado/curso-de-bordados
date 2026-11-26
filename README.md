# Atelier de Bordado — Online Embroidery Courses

Full-stack platform to present and sell digital embroidery courses. The v1 MVP includes a public marketing site, a database-driven course catalog, authentication, a private classroom, an operational admin panel, Mercado Pago checkout, webhook-driven fulfillment, transactional email and basic rate limiting.

> Status: v1 MVP validated locally. **Not deployed yet.** No production environment is configured.

## Screenshots

| Home | Course catalog |
| --- | --- |
| ![Home](docs/screenshots/01-home.png) | ![Course catalog](docs/screenshots/02-cursos.png) |

| Course detail | Checkout / login |
| --- | --- |
| ![Course detail](docs/screenshots/03-curso-detalle.png) | ![Login](docs/screenshots/05-login.png) |

| My courses | Classroom |
| --- | --- |
| ![My courses](docs/screenshots/07-mis-cursos.png) | ![Classroom](docs/screenshots/08-aula.png) |

| Admin panel | Contact |
| --- | --- |
| ![Admin](docs/screenshots/09-admin.png) | ![Contact](docs/screenshots/04-contacto.png) |

All screenshots are captured from the running application with seeded data.

## Stack

- Next.js 16 (App Router, `src/app`) + React 19
- TypeScript
- Tailwind CSS 4
- PostgreSQL + Prisma 7
- Auth.js / NextAuth v4 (credentials, JWT sessions)
- Zod + bcryptjs
- React Email with Resend or Brevo (transactional email; console provider is the local default)
- Mercado Pago via a small HTTP client (no SDK)
- Vitest + Testing Library + jsdom
- Docker Compose for the local PostgreSQL instance

## What it does

- Public pages: home, course catalog, course detail, about, contact.
- Courses and lessons served from PostgreSQL through Prisma.
- Registration, login, email verification, password recovery and reset.
- `emailVerifiedAt` exists but does not block login or access in v1.
- Private area: account page, my courses, and a per-enrollment classroom.
- Admin panel: contact leads, users, courses and enrollments.
- Mercado Pago checkout that creates a local `PENDING` order plus a payment preference.
- Fulfillment driven by the `merchant_order` webhook, not by the browser redirect.
- Guest checkout allowed; guest buyers get access through the password-reset flow.
- "Activate your access" transactional email when a purchase maps to a user without a password hash.
- Minimal rate limiting on sensitive public endpoints.

Out of scope for v1: CMS, course/content editor, advanced admin, refunds, media pipeline, Server Actions, production deploy.

## Requirements

- Node.js 20 or newer (verified on Node 24.21.0, npm 11.19.0)
- npm
- Docker (for the local PostgreSQL container) or an existing PostgreSQL instance

## Local setup

1. Install dependencies:

```bash
npm install
```

> `postinstall` runs `prisma generate`, so the Prisma client is ready after install.

2. Create your local environment file:

```bash
cp .env.example .env
```

3. Fill `.env` with local values (see [Environment variables](#environment-variables)). Never commit `.env`.

4. Start PostgreSQL:

```bash
docker compose up -d
```

5. Apply migrations:

```bash
npx prisma migrate deploy
```

6. Seed demo data (3 courses, 12 lessons, an admin and a student):

```bash
npm run db:seed
```

7. Start the dev server:

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

The seed creates three courses, twelve lessons, an admin account and a student
account. Define `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_STUDENT_EMAIL`
and `SEED_STUDENT_PASSWORD` before running `npm run db:seed`.

When those variables are unset the seed falls back to demo credentials. **Those
fallbacks are for local development only.** They are part of this public
repository, so any deployed instance must define its own: never run a public
deployment with the fallback passwords.

## Environment variables

`.env.example` lists safe placeholders. Required values depend on what you enable.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection used by Prisma. Throws if missing. |
| `AUTH_SECRET` / `NEXTAUTH_SECRET` | Yes in production | Auth.js session encryption. Falls back to a dev-only value outside production and throws in production. |
| `NEXTAUTH_URL` | Yes for checkout | Public base URL used by Auth.js and Mercado Pago `back_urls`. |
| `NEXT_PUBLIC_SITE_URL` | No | Public site URL (defaults to `http://localhost:3000`). |
| `AUTH_EMAIL_PROVIDER` | No | `console` (default), `resend` or `brevo`. |
| `AUTH_EMAIL_FROM` | When email is sent | Sender address for transactional email. |
| `AUTH_EMAIL_REPLY_TO` | No | Reply-to address. |
| `AUTH_EMAIL_BASE_URL` | No | Base URL for verification/reset links (falls back to the site URL). |
| `RESEND_API_KEY` | With `resend` | Resend API key. |
| `BREVO_API_KEY` | With `brevo` | Brevo API key (transactional email). |
| `MERCADO_PAGO_ACCESS_TOKEN` | Yes for payments | Private Mercado Pago token. Checkout fails without it. |
| `MERCADO_PAGO_WEBHOOK_SECRET` | Yes for fulfillment | Secret used to validate webhook signatures. |
| `MERCADO_PAGO_ALLOW_UNSIGNED_WEBHOOK_DEV` | No | Dev-only escape hatch; requires `NODE_ENV !== production`. Never enable in production. |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | No | Seed admin credentials. |
| `SEED_STUDENT_EMAIL` / `SEED_STUDENT_PASSWORD` | No | Seed student credentials. |

Local `DATABASE_URL` example matching `docker-compose.yml`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/susana_hilos_db"
```

Use it only as a local reference. Never commit real credentials.

## Scripts

```bash
npm run dev        # local dev server
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint
npm run test       # Vitest (watch)
npm run test:run   # Vitest single run
npm run db:seed    # seed the database
```

Useful Prisma commands:

```bash
npx prisma migrate deploy   # apply migrations
npx prisma migrate status   # check migration state
npx prisma studio           # database browser
```

`prisma/schema.prisma` is the source of truth for the data model; migrations live in `prisma/migrations`.

## Testing

```bash
npm run test:run
```

The suite runs 16 files / 53 tests and needs no database: Prisma and repositories are mocked. Coverage includes course view models and repositories, contact leads, paid-order finalization, Mercado Pago webhook signing, the checkout UI, auth/password copy pages, rate limiting and a smoke test.

Not covered yet: register/verify/reset route handlers, admin enrollment routes, and end-to-end tests.

## How payments work

1. Checkout creates a local `PENDING` order and a Mercado Pago preference.
2. Access is granted by the `merchant_order` webhook, never by the redirect.
3. `/checkout/success`, `/checkout/pending` and `/checkout/failure` are UX only.
4. `payment` notifications alone never grant access.

## Project structure

```
src/app            routes (marketing route group, admin, api handlers)
src/features       feature components and view models
src/server         use cases, repositories, email, payments
src/lib            auth, db client, validations, http helpers
prisma             schema, migrations, seed
docs/screenshots   real application screenshots
odd/tasks          engineering task and audit documents
```

## Security notes

- Never commit `.env`; keep `.env.example` with placeholders only.
- `AUTH_SECRET` is required in production — the app refuses to start without it.
- Never enable `MERCADO_PAGO_ALLOW_UNSIGNED_WEBHOOK_DEV` in production.
- Rate limiting is in-memory and per process; revisit before scaling horizontally.

## Project documentation

- `odd/tasks/auditoria.md` — repository audit: findings, decisions, pending work (Spanish).
- `PROJECT_STATE.md` — v1 MVP status (Spanish).
- `ARCHITECTURE_DECISIONS.md` — early architecture notes, partly outdated (Spanish).
- `AUTH_MVP_PLAN.md` — early auth plan, outdated against v1 (Spanish).

## License

[MIT](LICENSE) © 2026 Dario Mercado
