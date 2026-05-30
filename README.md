# Susana y los hilos de la memoria

Plataforma web fullstack para presentar y vender cursos digitales de bordado. El MVP v1 incluye sitio publico, cursos desde base de datos, autenticacion, aula privada, panel admin operativo, checkout Mercado Pago, fulfillment por webhook, email transaccional y rate limiting minimo.

> Estado actual: MVP v1 validado localmente y preparado para subir a GitHub. No esta desplegado todavia.

## Stack

- Next.js 16 App Router (`src/app`)
- React 19
- TypeScript
- Tailwind CSS 4
- PostgreSQL
- Prisma 7
- Auth.js / NextAuth v4
- Zod
- bcryptjs
- React Email + Resend
- Mercado Pago via HTTP/fetch propio
- Vitest + Testing Library + jsdom
- Docker Compose para PostgreSQL local

## Funcionalidad MVP v1

- Home, paginas de cursos, detalle de curso, sobre mi y contacto.
- Cursos/lecciones desde PostgreSQL via Prisma.
- Registro, login, verificacion de email, recuperacion/restablecimiento de contrasena.
- `emailVerifiedAt` no bloquea login/acceso en MVP v1.
- Area privada: mi cuenta, mis cursos y aula por enrollment.
- Admin operativo basico: leads, usuarios, cursos y enrollments.
- Checkout Mercado Pago para cursos.
- Fulfillment por webhook `merchant_order`, no por redirect.
- Compra guest permitida.
- Activacion post-compra guest usando reset password.
- Email transaccional "Activa tu acceso" cuando una compra queda asociada a un usuario sin `passwordHash`.
- Rate limiting minimo en endpoints publicos sensibles.

## Fuera del MVP v1

- CMS.
- Editor de cursos/contenido.
- Admin avanzado.
- Gestion avanzada de ordenes/pagos.
- Refunds automaticos.
- Cloudinary/media pipeline.
- Server Actions.
- Deploy productivo.

## Requisitos

- Node.js compatible con Next.js 16.
- npm.
- Docker Desktop o una instancia PostgreSQL local/remota.

## Setup local

1. Instalar dependencias:

```bash
npm install
```

2. Crear archivo de entorno local:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Completar `.env` con valores locales. No commitear `.env`.

4. Levantar PostgreSQL local con Docker:

```bash
docker compose up -d
```

5. Ejecutar migraciones Prisma:

```bash
npx prisma migrate dev
```

6. Cargar seed si corresponde:

```bash
npm run db:seed
```

7. Iniciar desarrollo:

```bash
npm run dev
```

La app queda disponible en `http://localhost:3000`.

## Docker / PostgreSQL

El proyecto incluye `docker-compose.yml` con PostgreSQL 16:

- host: `localhost`
- puerto: `5432`
- database: `susana_hilos_db`
- user: `postgres`
- password: `postgres`

Ejemplo de `DATABASE_URL` local:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/susana_hilos_db"
```

Usar este valor solo como referencia local. No subir secretos ni credenciales reales.

## Prisma

Comandos utiles:

```bash
npx prisma migrate dev
npx prisma migrate status
npx prisma studio
npm run db:seed
```

`prisma/schema.prisma` es la fuente de verdad del modelo de datos. Las migraciones estan en `prisma/migrations`.

## Scripts

```bash
npm run dev        # servidor local de desarrollo
npm run lint       # ESLint
npm run test       # Vitest interactivo
npm run test:run   # Vitest una sola corrida
npm run build      # build de produccion
npm run start      # servir build local
npm run db:seed    # seed Prisma
```

## Validacion MVP v1

Ultima validacion final registrada:

- `npm run lint` pasa con 1 warning no bloqueante.
- `npm run test:run` pasa: 16 files, 53 tests.
- `npm run build` pasa y genera 35 paginas.

## Variables de entorno

`.env.example` contiene placeholders seguros para GitHub/futuro deploy. La `.env` real no debe versionarse.

Variables principales:

| Variable | Uso |
| --- | --- |
| `DATABASE_URL` | Conexion PostgreSQL usada por Prisma. |
| `NEXTAUTH_SECRET` | Secreto de Auth.js/NextAuth. |
| `NEXTAUTH_URL` | URL base publica para Auth.js. |
| `NEXT_PUBLIC_SITE_URL` | URL publica del sitio. |
| `AUTH_EMAIL_PROVIDER` | `console` en local/dev o `resend` para email real. |
| `RESEND_API_KEY` | API key de Resend. |
| `AUTH_EMAIL_FROM` | Remitente de emails transaccionales. |
| `AUTH_EMAIL_REPLY_TO` | Reply-to de emails transaccionales. |
| `AUTH_EMAIL_BASE_URL` | URL base para links de verificacion/reset/activacion. |
| `MERCADO_PAGO_ACCESS_TOKEN` | Token privado de Mercado Pago. |
| `NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY` | Public key de Mercado Pago. |
| `MERCADO_PAGO_WEBHOOK_SECRET` | Secreto para validar webhooks. |
| `MERCADO_PAGO_ALLOW_UNSIGNED_WEBHOOK_DEV` | Solo local/dev; no habilitar en produccion. |

## Mercado Pago

- El checkout crea una orden local `PENDING` y una preferencia en Mercado Pago.
- El fulfillment real depende del webhook `merchant_order`.
- El redirect a `/checkout/success`, `/checkout/pending` o `/checkout/failure` es solo experiencia de usuario.
- Las notificaciones `payment` no otorgan acceso por si solas.

## Documentacion del proyecto

- `PROJECT_STATE.md`: fuente de verdad actual del MVP v1.
- `ARCHITECTURE_DECISIONS.md`: historico de arquitectura inicial; puede contener partes desactualizadas.
- `AUTH_MVP_PLAN.md`: historico del plan inicial de auth; desactualizado frente al MVP v1.

## Seguridad

- No subir `.env` ni secretos.
- Mantener `.env.example` con placeholders.
- No habilitar `MERCADO_PAGO_ALLOW_UNSIGNED_WEBHOOK_DEV` en produccion.
- Rotar secretos si alguna vez fueron expuestos fuera del entorno local.

## Estado de deploy

No hay deploy productivo todavia. El proyecto esta preparado para subir a GitHub; el deploy futuro requiere configurar base PostgreSQL productiva, variables reales, dominio publico, Mercado Pago y webhook publico.
