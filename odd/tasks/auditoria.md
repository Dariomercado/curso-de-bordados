# Auditoría de repositorio — curso-de-bordados

Repositorio: https://github.com/Dariomercado/curso-de-bordados (público) · Rama: `chore/audit-hardening` · Fecha: 2026-11-25 · Alcance: seguridad de secretos, build/ejecución, funcionalidad E2E, presentación. Sin push.

## Specs

- **S1** — Revisar archivos de entorno y credenciales en el working tree **y en todo el historial de git**, no solo en HEAD. Buscar tokens de pago (Mercado Pago), API keys, secretos JWT, contraseñas de base y credenciales SMTP. Verificar que `.gitignore` cubra `.env`, `node_modules`, `venv/__pycache__`, bases locales, `dist/build`. Si aparece algo: no borrarlo sin avisar; informar qué es, en qué commit entró y si el repo es público. No hacer push ni enlazar nada hasta resolverlo.
- **S2** — Instalar dependencias, informar si hace falta una versión específica de Node, si compila, si levanta, qué base necesita y cómo se inicializa. Usar los contenedores ya existentes (`curso-bordados-postgres-1` en 5432 y Mailpit en 8025), sin levantar otros. Informar variables de entorno obligatorias y si hay `.env.example`.
- **S3** — Sin bugs reportados: probar los flujos principales de punta a punta e informar qué está roto.
- **S4** — README en inglés (qué hace, stack, cómo correrlo, capturas); descripción y topics en GitHub; licencia; limpiar basura del origen Windows (`node_modules` commiteado, `dist`, `.DS_Store`, nombres con espacios y paréntesis); `.gitattributes` con `* text=auto eol=lf` si hay CRLF.
- **S5** — Crear `odd/tasks/auditoria.md` con hallazgos, decisiones y pendientes; commits convencionales en inglés en una rama; **SIN PUSH**; reportar qué estaba roto, qué se arregló, qué no se pudo y qué se necesita del humano.
- **S6** — Reglas: no agregar funcionalidad nueva, no reescribir el historial, no borrar archivos sin avisar, no hacer push. Si algo es ambiguo, preguntar antes de tocarlo.

## Tasks

- **T1** (S1) — Escaneo de secretos en árbol e historial completo — `done` — `7a3a0f8`
- **T2** (S2) — Toolchain, dependencias, build y puesta en marcha con la base provista — `done` — `7a3a0f8`
- **T3** (S3) — Pruebas E2E de los flujos principales — `done` — `7a3a0f8`
- **T4** (S5) — Documento de auditoría — `done` — `7a3a0f8`
- **T5** (S4) — Higiene de repositorio: `.gitignore` + `.gitattributes` — `done` — `6b75682`
- **T6** (S4) — Licencia MIT — `done` — `458b96f`
- **T7** (S2) — `prisma generate` en instalación (sin él, un clon limpio no corre la suite) — `done` — `443759d`
- **T8** (S4) — README en inglés + capturas reales — `done` — `5596a06`
- **T9** (S4) — Eliminar restos de Create Next App — `done` — `505765b`
- **T10** (S4) — Descripción y topics del repositorio en GitHub — `done` (metadatos, sin commits)
- **T11** (S5) — Reporte final al humano — `done`

### Slice de entrega

La rama `chore/audit-hardening` acumula **6 commits y ~500 líneas autoradas** (sin lockfiles) sobre `origin/main`. Supera el slice de ~400 líneas, así que el límite de revisión queda registrado acá: si esto se publica, conviene partirlo en dos PR encadenados — (1) auditoría e higiene (`7a3a0f8`, `6b75682`, `458b96f`, `443759d`) y (2) presentación (`5596a06`, `505765b`). Sin push, por pedido explícito.

## Hallazgos

### 1. Secretos (S1)

**Resultado: no hay credenciales reales, ni en el working tree ni en el historial.**

- El repositorio es **público** (`git clone` anónimo y API de GitHub funcionan sin credenciales).
- Historial: 4 commits, una sola rama (`main`), sin tags. Nunca se commiteó `.env`, `.env.local`, `*.pem`, claves privadas ni `node_modules`.
- El único archivo de entorno en toda la historia es `.env.example`, commiteado en `4ce9811` con placeholders vacíos.
- Búsqueda de patrones en los diffs de la historia (`APP_USR`, `APP_ID`, `sk_live`, `BEGIN PRIVATE KEY`, `postgres://usuario:clave@`, `SECRET=` con valor, `password=`): **cero coincidencias**.
- La única cadena con pinta de credencial es `postgresql://postgres:postgres@localhost:5432/susana_hilos_db` en `README.md:116` (presente desde `4ce9811`). Es la credencial local del `docker-compose`, no un secreto de producción.
- **Nada que rotar.** No hace falta tocar Mercado Pago, Resend ni la base.

Fallbacks que sí existen en el código (aceptables, pero conviene conocerlos):

| Ubicación | Qué hace | Riesgo |
| --- | --- | --- |
| `src/lib/auth/secret.ts:2-9` | `AUTH_SECRET ?? NEXTAUTH_SECRET ?? "dev-only-auth-secret-change-me"`, **solo** si `NODE_ENV !== "production"`; en producción lanza error | Bajo: falla cerrado |
| `prisma/seed.ts:159-167` | Contraseñas por defecto del seed cuando `SEED_*_PASSWORD` no está definida. Los valores son públicos (están en el repo), así que un entorno desplegado debe definir los suyos | Medio: con el sitio publicado y las credenciales en el README, cualquiera entraba al panel admin. Corregido: contraseñas rotadas en Neon y README sin valores |
| `docker-compose.yml:6-8` | `POSTGRES_PASSWORD: postgres` | Bajo: contenedor local |
| `src/server/use-cases/process-mercadopago-webhook.ts:47-58` | Bypass de firma solo con `NODE_ENV !== "production"` **y** `MERCADO_PAGO_ALLOW_UNSIGNED_WEBHOOK_DEV === "true"` | Bajo: doble condición |

### 2. Build y ejecución (S2)

- **Node:** el proyecto no fija versión — no hay `engines` en `package.json` ni `.nvmrc`. Verificado con Node **24.21.0** y npm 11.19.0; funciona. Recomendación: fijar `engines: { "node": ">=20" }`.
- **Instalación:** `npm ci` OK. Advertencia relevante: 6 paquetes con install-scripts no se ejecutaron (política local de `allowScripts`), entre ellos `@prisma/engines` y `esbuild`.
- **Defecto real encontrado:** el proyecto **no tiene `postinstall: prisma generate`**. En un clon limpio, `npm install` deja el cliente Prisma sin generar y **4 de 16 suites fallan** con `Cannot find module '.prisma/client/default'`. Corregido en `build: generate prisma client on install`.
- **Lint:** `npx eslint .` → 0 errores, 1 warning (`next.config.ts:8`, export anónimo). Coincide con lo que declara el README.
- **Tests:** 16/16 archivos, **53/53 tests** en verde (antes de la corrección: 12/16 archivos). No necesitan base de datos: mockean Prisma y repositorios.
- **Build:** `npm run build` OK, **35 rutas** generadas.
- **Base de datos:** PostgreSQL vía Prisma 7. Inicialización: `npx prisma migrate deploy` (5 migraciones) + `npm run db:seed` (3 cursos, 12 lecciones, 2 usuarios, 1 matrícula).
- **Advertencia importante sobre los contenedores:** `curso-bordados-postgres-1` **no contenía el esquema de este proyecto**. Adentro vivía otra aplicación en Python/SQLAlchemy/Alembic (`alembic_version`, `student_accounts`, `webauthn_credentials`, `courses` en minúscula). No existían `_prisma_migrations` ni las tablas `User`/`Course`/`Order`. Decisión del humano: crear la base `curso_bordados_next` **en el mismo contenedor**, sin tocar los datos de la otra app. Los datos existentes no se modificaron.
- **Mailpit es irrelevante para esta app:** el correo transaccional sale por **Resend** o por el proveedor `console`, que escribe el email completo en el log del servidor. No hay cliente SMTP en el código. Mailpit quedó sin uso.
- **Desfase de configuración:** `docker-compose.yml` declara `postgres:16`, usuario `postgres` y base `susana_hilos_db`; el contenedor real corre `postgres:17.6-alpine` con usuario `susana` y base `susana_bordados`. Seguir el README al pie de la letra (`docker compose up -d`) **falla** porque el puerto 5432 ya está tomado por ese contenedor.
- **`.env.example`:** documentado como bloqueado por la política de seguridad del harness (no se pudo leer ni editar). Ver *Pendientes*.
- **Variables obligatorias** (derivadas del código, no del archivo): `DATABASE_URL` (obligatoria, `src/lib/db/prisma.ts:8`), `AUTH_SECRET`/`NEXTAUTH_SECRET` (obligatoria en producción), `NEXTAUTH_URL` (obligatoria para checkout), `MERCADO_PAGO_ACCESS_TOKEN` (obligatoria para cobrar), `MERCADO_PAGO_WEBHOOK_SECRET` (obligatoria para validar webhooks), `AUTH_EMAIL_FROM` (obligatoria si se manda email). Opcionales con default: `NEXT_PUBLIC_SITE_URL`, `AUTH_EMAIL_PROVIDER`, `AUTH_EMAIL_REPLY_TO`, `RESEND_API_KEY` (solo con provider `resend`), `SEED_*`.
- **Variable muerta, ya removida:** `NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY` no la lee el código (`grep -rn PUBLIC_KEY src/` → 0 resultados). El checkout es server-side (`client.ts:101` crea la preferencia con el access token y `client.ts:163` devuelve `init_point`), así que la public key sólo serviría con Checkout Bricks/JS SDK en el cliente. El humano la eliminó de `.env.example` durante la auditoría; el README reescrito nunca la lista. Nada que rotar: no es una credencial, es una variable sin uso.

### 3. Funcionalidad (S3)

Batería E2E contra el build de producción en `:3000`, con la base sembrada. **28 comprobaciones en verde.**

Verificado y funcionando:

- Guardas de sesión: `/mi-cuenta`, `/mis-cursos`, `/admin`, `/admin/usuarios`, `/admin/cursos`, `/admin/leads` → `307` a `/login` con `callbackUrl` correcto.
- Rol: una alumna autenticada en `/admin` recibe `307`; la API de admin responde `401` anónimo, `403` para alumna, `400` con payload inválido.
- Públicas: `/`, `/cursos`, `/sobre-mi`, `/contacto`, `/login`, `/registro`, detalle de curso → `200`. El catálogo lista los 3 cursos.
- Registro: alta nueva `201`, email duplicado `409`, payload inválido `400`.
- Verificación de email: el link `/api/auth/email/verify?token=…` redirige a `code=success`; **el reuso del token se rechaza** con `code=used`.
- Login/logout: credenciales válidas `200`, sesión expone `id`, `email`, `role`; tras el logout el área privada vuelve a `307`.
- Recuperación de contraseña: `forgot` `200` y emite token; `reset` sin `confirmPassword` `400` (validación correcta), con `confirmPassword` `200`; login con la clave nueva funciona; **reuso del token `410`**.
- Aula: la alumna con matrícula entra a `/mis-cursos/bordado-para-principiantes` y ve las 4 clases.
- **Aislamiento de contenido pago: correcto.** Una alumna sin matrícula a `disenos-florales` **no ve lecciones**; la página resuelve a `notFound()` (digest `NEXT_HTTP_ERROR_FALLBACK;404`). No hay fuga de contenido.
- Contacto: alta válida `201`, inválida `400`; rate limit corta con `429` (cuenta IP + identificador).
- Webhook de Mercado Pago: sin firma `401`.

Roto o incompleto:

- **`notFound()` devuelve HTTP 200 en rutas con `loading.tsx`.** `/cursos/no-existe-xyz` y `/mis-cursos/<slug-sin-matricula>` responden `200` con la pantalla 404 por defecto de Next **en inglés** ("404: This page could not be found."). Causa: el `loading.tsx` inicia el streaming, los headers ya se enviaron y el `notFound()` posterior no puede fijar el status. Impacto: soft-404 para buscadores y una pantalla en inglés en un sitio en español. **No corregido** (ver Pendientes) — requiere decidir entre quitar los `loading.tsx` de esas ramas o agregar un `not-found.tsx` propio y aceptar el 200.
- **Checkout de Mercado Pago no operable sin configurar.** `POST /api/payments/mercadopago/checkout` → `502` con `"Falta configurar MERCADO_PAGO_ACCESS_TOKEN…"`. Es el comportamiento esperado con el entorno de auditoría, no un bug.
- Rate limit en memoria: el `Map` es por proceso, no persiste ni se comparte entre instancias; y la IP sale de `x-forwarded-for` **sin validar el proxy**, así que un cliente puede falsearla. Aceptable para MVP, a revisar antes de producción.

Cobertura de tests incompleta: no hay tests para los handlers de registro/verificación/reset ni para enrollments de admin, y no hay e2e automatizado (Playwright quedó fuera del repo, sólo se usó para las capturas).

### 4. Presentación (S4)

- **README:** estaba **sólo en español**, sin capturas, sin versión de Node, sin licencia ni topics. Reescrito en inglés con stack, requisitos, setup, variables, comandos, verificación y capturas reales.
- **Licencia:** no había. Se agregó **MIT**, © 2026 Dario Mercado.
- **EOL:** no había CRLF. `git ls-files --eol` → 322 archivos `i/lf`, 0 con CRLF. Se agregó `.gitattributes` con `* text=auto eol=lf` para blindar el árbol y marcar binarios.
- **Basura del origen Windows: no existe.** No hay `node_modules` commiteado, ni `dist`, ni `build`, ni `.next`, ni `.DS_Store`. No hay archivos con espacios en el nombre. Los únicos paréntesis están en `src/app/(marketing)/`, que es **convención de route group de Next.js**: renombrarlos rompería las rutas. **No se tocó nada de eso.**
- **Lo único descartable** eran restos de Create Next App (`public/next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`), eliminados en un commit aparte.
- **`.gitignore`** cubría `node_modules`, `.next`, `out`, `build`, `.DS_Store`, `*.pem`, `.env*` y `coverage`. Se agregaron `dist/`, `.turbo/`, `.idea/`, `.vscode/`, `venv/`, `__pycache__/`, `*.sqlite*`, `*.dump`, `*.sql`, `.atl/`.
- Otros documentos (`PROJECT_STATE.md`, `ARCHITECTURE_DECISIONS.md`, `AUTH_MVP_PLAN.md`) siguen en español y se auto-declaran históricos: se dejaron, ahora referenciados desde el README.

## Decisiones

- **D1** — La base de prueba se crea **nueva** (`curso_bordados_next`) dentro del contenedor existente, para no mezclar el esquema Prisma con la app Python que ya vivía ahí. (Decisión del humano.)
- **D2** — Licencia **MIT**, © 2026 Dario Mercado. (Decisión del humano.)
- **D3** — Capturas **reales** de la app corriendo, no los mockups de `context-ai/reference`. (Decisión del humano.)
- **D4** — Se eliminan los SVG de Create Next App; **no** se tocan `(marketing)` ni otros nombres, y no se borra nada más. (Decisión del humano.)
- **D5** — `.env.example` no se modifica: bloqueado por la política de seguridad del harness. (Ver Pendientes.)
- **D6** — No se agrega funcionalidad. Los únicos cambios no-documentales son: `postinstall` para generar Prisma, `.gitignore`, `.gitattributes` y el borrado de assets sin uso.
- **D7** — No se reescribe el historial y no se hace push.

## Pendientes

1. **`notFound()` con status 200 y 404 por defecto en inglés.** Agregar `not-found.tsx` propio y decidir si se quitan los `loading.tsx` de `cursos/[slug]` y `mis-cursos/[slug]` para recuperar el 404 real. Requiere decisión de UX/SEO.
2. **`.env.example`: resuelto en parte.** El humano eliminó `NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY` del archivo. Falta todavía agregar `AUTH_SECRET` y `MERCADO_PAGO_WEBHOOK_SECRET`, que el código exige y la plantilla no listaba. El archivo sigue bloqueado para el agente por la política de seguridad, así que esa edición la hace el humano.
3. **`docker-compose.yml` desactualizado** respecto del contenedor real (imagen, usuario, base y credenciales). Alinear o documentar el puerto alternativo.
4. **Versión de Node sin fijar.** Agregar `engines` y, opcionalmente, `.nvmrc`.
5. **Rate limit en memoria y `x-forwarded-for` sin validar.** Definir almacenamiento compartido y confianza de proxy antes de producción.
6. **Tests faltantes** para registro, verificación, reset y enrollments de admin; sin e2e automatizado en el repo.
7. **Migraciones duplicadas en nombre:** `20260506071615_add_auth_tokens_and_email_verification` y `20260506120000_add_auth_tokens_and_email_verification` hacen cosas distintas. No se tocó porque renombrar migraciones ya aplicadas es riesgoso.
8. **`prisma` como dependencia de runtime** y `next-auth` v4 sobre Next 16: revisar cuándo se planifique el salto a Auth.js v5.
9. **Metadatos de GitHub:** descripción y topics actualizados; si se quiere homepage o plantilla de issues, definirlo.

## Log

- **L1** — Pedido original del humano (ver *Anexo: pedido original* al final del documento).
- **L2** — El humano autorizó leer y actualizar `.env.example`; el harness lo siguió bloqueando, así que se resolvió por informe (D5).
- **L3** — El humano eligió base nueva en el mismo contenedor (D1), licencia MIT (D2), capturas reales (D3) y borrar los SVG de CNA (D4).
- **L4** — Evidencia: `npm ci` OK; `eslint` 0 errores/1 warning; `vitest run` 53/53; `next build` 35 rutas; 28 comprobaciones E2E en verde; 9 capturas.
- **L5** — Despliegue: Neon (São Paulo) con migraciones y seed; proyecto Vercel `curso-de-bordados`; el dominio pelado `curso-de-bordados.vercel.app` estaba tomado por un tercero, así que el dominio real es `curso-de-bordados-dario-mercados-projects-1872c674.vercel.app`. Deployment Protection estaba activo y se desactivó a pedido del humano. E2E contra la URL pública: 26/26 en verde.
- **L6** — Incidente de seguridad propio: el README público listaba las credenciales de seed y el sitio estaba desplegado con esas mismas contraseñas, dejando el panel de admin abierto a cualquiera. Con autorización del humano se rotaron las contraseñas de admin y alumna en Neon y se sacaron los valores del README. `ContactLead` tenía 0 filas, así que no hubo datos personales expuestos.

## Anexo: pedido original

> 1. SECRETOS — bloqueante, primero
>    - Archivos de entorno y credenciales en el working tree Y en todo el historial de git, no solo en HEAD. Un secreto en el historial sigue expuesto aunque lo borres.
>    - Tokens de pago (este proyecto usa Mercado Pago), API keys, secretos JWT, contraseñas de base, credenciales SMTP.
>    - Que .gitignore cubra .env, node_modules, venv/__pycache__, bases locales, dist/build.
>    Si encontrás algo: no lo borres sin avisarme. Decime qué es, en qué commit entró y si el repo es público. Si es una credencial real hay que rotarla en el proveedor, y eso lo hago yo. No hagas push ni linkees nada hasta resolverlo.
>
> 2. ¿COMPILA Y CORRE?
>    - Instalá dependencias y decime si hace falta una versión específica de Node.
>    - ¿Compila? ¿Levanta? ¿Qué base necesita y cómo se inicializa?
>    - Ya hay un contenedor corriendo para este proyecto: curso-bordados-postgres-1 en el puerto 5432, y Mailpit en 8025 para el correo. Usá esos, no levantes otros.
>    - ¿Qué variables de entorno son obligatorias? ¿Hay un .env.example?
>
> 3. FUNCIONALIDAD
>    - No tengo bugs reportados todavía: probá los flujos principales de punta a punta y decime qué está roto.
>
> 4. PRESENTACIÓN
>    - README en inglés: qué hace, stack, cómo correrlo, capturas.
>    - Descripción y topics en GitHub.
>    - Licencia.
>    - Basura del origen Windows: node_modules commiteado, dist, .DS_Store, nombres con espacios y paréntesis.
>    - .gitattributes con * text=auto eol=lf si hay CRLF.
>
> 5. CIERRE
>    - Creá odd/tasks/auditoria.md en el repo con hallazgos, decisiones y pendientes.
>    - Commits convencionales en inglés, en una rama. SIN PUSH.
>    - Reportame: qué estaba roto, qué arreglaste, qué no pudiste y qué necesitás de mí.
>
> Reglas: no agregues funcionalidad nueva, no reescribas el historial, no borres archivos sin avisarme, y no hagas push. Si algo es ambiguo, preguntá antes de tocarlo.
