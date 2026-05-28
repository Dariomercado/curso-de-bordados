# Project State

> Fuente de verdad actualizada para continuar el proyecto en Codex Desktop.
> Ultima auditoria local: 2026-05-28.

## 1. Estado real actual

El proyecto es una aplicacion fullstack en Next.js App Router para presentar y vender cursos digitales de bordado, con backend dentro de Next.js, PostgreSQL via Prisma, Auth.js, email transaccional y una integracion inicial de Mercado Pago.

El estado actual es mas avanzado que la documentacion historica: ya no es solo un sitio institucional con auth basico. Existen registro, verificacion de email, recuperacion de contrasena, aula privada, skeletons/loading UX, checkout Mercado Pago y webhook de fulfillment para asignar accesos.

No se detecto un CMS ni panel avanzado de contenidos. Muchas secciones publicas siguen usando contenido editorial estatico desde `src/data`.

## 2. Stack confirmado

- Next.js `16.2.1` con App Router en `src/app`.
- React `19.2.4` y React DOM `19.2.4`.
- TypeScript estricto.
- Tailwind CSS 4 con `@tailwindcss/postcss`.
- PostgreSQL.
- Prisma 7 (`@prisma/client`, `prisma`, `@prisma/adapter-pg`, `pg`).
- Auth.js mediante `next-auth` v4 + `@auth/prisma-adapter`.
- Validacion con Zod.
- Password hashing con `bcryptjs`.
- Email transaccional con `@react-email/components`, `@react-email/render`, `react-email` y `resend`.
- Testing con Vitest, Testing Library y jsdom.
- Mercado Pago integrado por HTTP/API propia, sin SDK directo `mercadopago` en dependencias.

## 3. Estructura auditada

```text
src/
  app/
    (marketing)/
      page.tsx
      layout.tsx
      cursos/
        page.tsx
        loading.tsx
        [slug]/
          page.tsx
          loading.tsx
    admin/
      layout.tsx
      loading.tsx
      page.tsx
      leads/page.tsx
      usuarios/page.tsx
      cursos/page.tsx
    api/
      admin/enrollments/route.ts
      admin/enrollments/[id]/route.ts
      auth/[...nextauth]/route.ts
      auth/register/route.ts
      auth/email/resend/route.ts
      auth/email/verify/route.ts
      auth/password/forgot/route.ts
      auth/password/reset/route.ts
      contact/route.ts
      payments/mercadopago/checkout/route.ts
      payments/mercadopago/webhook/route.ts
    checkout/
      layout.tsx
      success/page.tsx
      pending/page.tsx
      failure/page.tsx
      _components/CheckoutReturnPage.tsx
    contacto/page.tsx
    login/page.tsx
    mi-cuenta/page.tsx
    mis-cursos/
      layout.tsx
      page.tsx
      [slug]/page.tsx
    recuperar-contrasena/page.tsx
    registro/page.tsx
    restablecer-contrasena/page.tsx
    sobre-mi/page.tsx
    verificar-email/page.tsx
    layout.tsx
    globals.css
    robots.ts
    sitemap.ts
  components/
    layout/
    sections/
    ui/
      skeletons/
  data/
  features/
    admin/
    auth/
    classroom/
    contact/
    courses/
  lib/
    auth/
    db/
    http/
    payments/mercadopago/
    validations/
  server/
    email/
    repositories/
    use-cases/
  test/
  types/

prisma/
  schema.prisma
  seed.ts
  migrations/

context-ai/
scripts/
middleware.ts
prisma.config.ts
vitest.config.ts
next.config.ts
```

## 4. Paginas y rutas implementadas

### Publicas / marketing

- `/`: home completa. Usa DB real para cursos destacados y `src/data` para contenido editorial.
- `/cursos`: listado de cursos publicados desde Prisma.
- `/cursos/[slug]`: detalle de curso publicado desde Prisma. Consulta sesion/enrollment y muestra CTA distinto si el usuario ya tiene acceso.
- `/sobre-mi`: pagina editorial estatica.
- `/contacto`: pagina editorial con formulario conectado a `/api/contact`.

### Auth y cuenta

- `/login`: login con credenciales.
- `/registro`: registro publico de estudiante.
- `/verificar-email`: pantalla de resultado de verificacion.
- `/recuperar-contrasena`: solicitud de reset.
- `/restablecer-contrasena`: formulario de nueva contrasena con token.
- `/mi-cuenta`: area privada basica del usuario.
- `/mis-cursos`: listado privado de cursos asignados.
- `/mis-cursos/[slug]`: aula privada para curso asignado.

### Admin

- `/admin`: dashboard minimo con metricas.
- `/admin/leads`: listado basico de leads.
- `/admin/usuarios`: usuarios `STUDENT` y gestion minima de enrollments.
- `/admin/cursos`: vista basica de cursos y accesos.

### Checkout

- `/checkout/success`
- `/checkout/pending`
- `/checkout/failure`

Estas paginas existen como retornos de checkout. El otorgamiento real de acceso depende del webhook/fulfillment, no solo del retorno del navegador.

## 5. Backend y APIs implementadas

### Auth

- `GET/POST /api/auth/[...nextauth]` via Auth.js.
- `POST /api/auth/register` para crear o reclamar cuenta de estudiante.
- `POST /api/auth/email/resend` para reenviar verificacion.
- `GET /api/auth/email/verify` para consumir token y redirigir a resultado.
- `POST /api/auth/password/forgot` para iniciar reset con respuesta anti-enumeration.
- `POST /api/auth/password/reset` para consumir token y actualizar password.

### Contacto

- `POST /api/contact` valida con Zod y persiste `ContactLead`.

### Admin enrollments

- `POST /api/admin/enrollments` asigna acceso a curso publicado.
- `DELETE /api/admin/enrollments/[id]` revoca acceso. El handler dinamico usa `await` de `params` para Next 16.

### Pagos Mercado Pago

- `POST /api/payments/mercadopago/checkout` crea una orden local `PENDING`, crea preferencia en Mercado Pago y devuelve `initPoint`/`sandboxInitPoint`.
- `POST /api/payments/mercadopago/webhook` procesa notificaciones. La fuente de verdad de fulfillment es `merchant_order`; los webhooks `payment` se ignoran para fulfillment.
- `finalizePaidOrder` valida estado, moneda ARS, monto y external reference; luego marca la orden como `PAID`, crea/upsertea usuario por email y crea enrollment si falta.

## 6. Modelo de datos real

`prisma/schema.prisma` es la fuente de verdad del modelo. Modelos presentes:

- `User`
- `Course`
- `Lesson`
- `Order`
- `PurchaseItem`
- `Enrollment`
- `ContactLead`
- `Account`
- `Session`
- `VerificationToken`
- `AuthToken`

Enums presentes:

- `UserRole`
- `AuthTokenType`
- `CourseStatus`
- `OrderStatus`
- `ProductType`

Diferencias importantes respecto de documentacion anterior:

- `User` ya incluye `emailVerifiedAt` y relacion `authTokens`.
- `AuthToken` existe para verificacion de email y reset de password.
- `Order` ya soporta compra guest con `buyerEmail`, `userId` opcional, `externalReference`, `mercadoPagoPreferenceId` y `mercadoPagoPaymentId`.
- `Order.userId` ya no es obligatorio.

## 7. Fuentes de datos actuales

### DB real con Prisma

Usan DB real:

- cursos publicados y destacados;
- detalle de curso y metadata;
- lecciones/aula privada;
- usuarios;
- sesiones/cuentas Auth.js;
- tokens de auth propios (`AuthToken`);
- enrollments;
- ordenes y purchase items;
- leads de contacto;
- admin basico.

### Contenido estatico/editorial

Siguen en `src/data`:

- navegacion;
- hero;
- propuesta de valor;
- textos editoriales de cursos;
- about/sobre-mi;
- kits;
- beneficios;
- testimonios;
- CTA final;
- footer;
- contenido editorial de contacto.

## 8. Modulos terminados o funcionales en alcance actual

- Sitio publico base: home, cursos, detalle, sobre-mi, contacto.
- Persistencia de cursos/lecciones/contact leads/usuarios/enrollments/ordenes.
- Auth con credenciales, JWT, roles `ADMIN`/`STUDENT` y guards server-side.
- Registro publico de estudiante con token de verificacion.
- Reenvio de verificacion de email.
- Recuperacion y reset de contrasena.
- Infraestructura de email transaccional con providers `console` y `resend`.
- Preview local dev-only de links de verificacion/reset cuando `AUTH_EMAIL_PROVIDER=console`.
- Panel alumno basico.
- Aula privada por enrollment en `/mis-cursos/[slug]`.
- Panel admin minimo con leads, usuarios, cursos y gestion de enrollments.
- Checkout Mercado Pago inicial para cursos.
- Webhook Mercado Pago con validacion de firma para `merchant_order` y fulfillment idempotente basico.
- Skeleton/loading UX en rutas criticas: cursos, detalle, login, registro, mi-cuenta, mis-cursos, aula, admin.
- Tests unitarios/integracion livianos sobre cursos, contacto, checkout UI y pagos/webhook.

## 9. Pendiente para cerrar un MVP solido

### Critico antes de produccion

- Verificar punta a punta el flujo Mercado Pago en entorno real/sandbox: checkout, redirect, webhook firmado `merchant_order`, orden `PAID`, usuario/enrollment creado.
- Definir la estrategia de cuenta post-compra para usuarios creados automaticamente sin password: actualmente el fulfillment puede crear usuario por email y asignar acceso, pero el comprador necesita un camino claro para activar/entrar a su cuenta.
- Revisar si login debe exigir `emailVerifiedAt`; hoy el login valida password/isActive, pero no bloquea por email no verificado.
- Completar variables de entorno reales y documentarlas para deploy (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL`, Mercado Pago, email).
- Revisar seguridad/rate limiting: la arquitectura lo menciona, pero no se ve rate limiting implementado en login, contacto, registro o reset.
- Ejecutar una pasada completa de `npm run lint`, `npm run test:run` y `npm run build` antes de handoff/deploy.

### Producto / UX

- Mejorar UX post-compra: mensajes de pending/success/failure, instrucciones para revisar email/activar cuenta y acceder a `/mis-cursos`.
- Definir contenido e imagenes definitivas.
- Decidir si kits entran en MVP o quedan como editorial/mock.
- Revisar copy con caracteres/acentos: varios textos muestran problemas de encoding en archivos/documentacion.
- Mejorar estados vacios y errores en admin/aula si se desea una experiencia mas pulida.

### Backend / dominio

- Agregar tests faltantes para registro, verificacion, reset y enrollments admin.
- Agregar tests E2E/manual checklist para compra y acceso.
- Definir manejo de ordenes fallidas/canceladas/refunded si el MVP lo requiere.
- Evaluar expiracion/limpieza de tokens `AuthToken` consumidos o vencidos.
- Mantener Route Handlers; no introducir Server Actions salvo decision arquitectonica explicita.

### Admin / contenido

- No hay editor de cursos ni CMS. Los cursos dependen de DB/seed o cambios manuales.
- Admin no gestiona ordenes ni pagos.
- Admin de usuarios esta acotado a estudiantes y enrollments.

## 10. Inconsistencias entre documentacion y codigo

- `PROJECT_STATE.md` estaba desactualizado: no reflejaba registro, verificacion, reset, aula privada, email transaccional, pagos Mercado Pago, skeletons ni rutas `(marketing)`.
- `AUTH_MVP_PLAN.md` dice que no se implementarian registro publico, recuperacion de contrasena, email verification, pagos automaticos ni asignacion automatica por compra; el codigo actual ya implementa esas capacidades al menos en version inicial.
- `ARCHITECTURE_DECISIONS.md` marca email transaccional y pagos como futuro/no MVP; el codigo actual ya incluye infraestructura de email y pagos Mercado Pago.
- `ARCHITECTURE_DECISIONS.md` declara Cloudinary para media, pero no hay dependencia `cloudinary` ni integracion real visible; las imagenes actuales son assets locales/URLs guardadas.
- `ARCHITECTURE_DECISIONS.md` menciona rate limiting como regla de seguridad; no se detecto implementacion concreta.
- La documentacion historica menciona `/app` de forma generica; el proyecto real usa `src/app` y route group `(marketing)`.
- `README.md` sigue siendo el README default de Next.js y no describe este proyecto.
- `.env.example` no incluye explicitamente `DATABASE_URL` ni `NEXTAUTH_SECRET`, aunque el proyecto los necesita.

## 11. Auditoria de dependencias

### Dependencias principales confirmadas

- Core app: `next`, `react`, `react-dom`, `typescript`.
- DB/ORM: `prisma`, `@prisma/client`, `@prisma/adapter-pg`, `pg`, `dotenv`.
- Auth: `next-auth`, `@auth/prisma-adapter`, `bcryptjs`.
- Validacion: `zod`.
- Email: `@react-email/components`, `@react-email/render`, `react-email`, `resend`.
- Testing/dev: `vitest`, `jsdom`, Testing Library, ESLint, Tailwind.

### Paquetes innecesarios o sospechosos

- No se detectan dependencias directas evidentemente maliciosas en `package.json`.
- `react-email` puede ser revisable: si solo se renderizan templates en runtime, podria alcanzar con `@react-email/components` y `@react-email/render`; no eliminar sin verificar uso real.
- No hay SDK directo `mercadopago`; la integracion usa `fetch`/HTTP propio. Esto es una decision valida, pero debe documentarse.
- No hay `cloudinary` instalado aunque la arquitectura lo menciona. No instalar hasta que exista una feature real de media.

### Acciones seguras recomendadas

- No ejecutar `npm audit fix` automaticamente.
- Antes de tocar dependencias, correr solo auditoria/diagnostico y revisar impacto de lockfile.
- Mantener `package-lock.json` versionado y no regenerarlo sin necesidad.

## 12. Reglas tecnicas importantes

- `PROJECT_STATE.md` describe el estado real implementado.
- `ARCHITECTURE_DECISIONS.md` describe intencion/criterios; si contradice codigo real, documentar antes de cambiar.
- `prisma/schema.prisma` es la fuente de verdad para datos.
- No usar Server Actions; backend mediante Route Handlers y use-cases.
- Validaciones nuevas con Zod.
- Mantener separacion UI / validacion / use-cases / repositories.
- Evitar logica compleja en `page.tsx` cuando pueda ir a use-cases/repositorios.
- Proteger rutas privadas con middleware y guards server-side.
- Respuestas de auth sensibles deben mantener anti-enumeration cuando aplique.
- Webhook de Mercado Pago: fulfillment por `merchant_order`, no por `payment`.
- No instalar ni actualizar dependencias sin decision explicita.

## 13. Bugs conocidos / riesgos actuales

- Posible gap de activacion post-compra: `finalizePaidOrder` puede crear usuario sin password y asignar enrollment; falta confirmar UX para que ese comprador cree/recupere acceso facilmente.
- Email verification no parece bloquear login por credenciales; puede ser intencional, pero debe decidirse para MVP.
- Rate limiting documentado pero no implementado.
- `ARCHITECTURE_DECISIONS.md`, `AUTH_MVP_PLAN.md` y varios textos muestran caracteres mal codificados; conviene normalizar encoding antes de una entrega publica.
- `.env.example` incompleto para arranque real por falta de `DATABASE_URL`/`NEXTAUTH_SECRET`.
- El estado real de DB local no fue validado en esta auditoria; se reviso codigo y schema, no se corrio migracion/seed/test-db.
- Hay muchos archivos sin tracking segun `git status`; antes de handoff conviene confirmar que el repo/branch representa correctamente el trabajo.

## 14. Proximos pasos recomendados

1. Correr verificacion local completa: `npm run lint`, `npm run test:run`, `npm run build`.
2. Completar/documentar `.env.example` con variables obligatorias reales.
3. Hacer QA manual del flujo auth completo: registro, verificacion, login, forgot/reset, logout.
4. Hacer QA manual del flujo compra: checkout Mercado Pago, webhook, orden pagada, enrollment, acceso a aula.
5. Definir y cerrar UX de comprador post-pago sin password.
6. Decidir politica de `emailVerifiedAt` para login/acceso.
7. Agregar tests para auth y admin enrollments.
8. Actualizar `ARCHITECTURE_DECISIONS.md` y `AUTH_MVP_PLAN.md` en una tarea separada para reflejar evolucion real.
9. Revisar encoding/copy y README.
10. Preparar deploy con variables, base de datos y webhook publico.

## 15. Codex Desktop Handoff

### Resumen del estado actual

Proyecto fullstack en Next.js 16 con sitio publico, cursos desde DB, auth completo en version inicial, panel admin minimo, aula privada, email transaccional y checkout Mercado Pago inicial. El MVP esta cerca, pero todavia requiere QA fuerte, ajustes de documentacion/configuracion y decisiones puntuales sobre acceso post-compra y verificacion de email.

### Stack confirmado

Next.js App Router, React 19, TypeScript, Tailwind 4, Prisma 7, PostgreSQL, Auth.js/NextAuth v4, Zod, React Email, Resend, Mercado Pago via HTTP propio, Vitest + Testing Library.

### Reglas tecnicas importantes

- No Server Actions.
- Route Handlers para APIs.
- Use-cases en `src/server/use-cases`.
- Repositories en `src/server/repositories`.
- Zod para inputs.
- Prisma schema como fuente de verdad de datos.
- Mantener cambios chicos, auditables y alineados con docs.
- No tocar dependencias sin motivo y sin revisar lockfile.

### Modulos terminados

- Marketing/home base.
- Cursos publicos desde DB.
- Contacto con persistencia.
- Auth credenciales + roles.
- Registro/verificacion/reset.
- Email transaccional console/resend.
- Mi cuenta y mis cursos.
- Aula privada por enrollment.
- Admin basico y gestion minima de enrollments.
- Checkout Mercado Pago inicial.
- Webhook merchant_order y fulfillment de acceso.
- Loading UX/skeleton baseline.

### Modulos pendientes

- UX post-compra y activacion de cuenta.
- QA final de Mercado Pago y webhook firmado.
- Politica final de email verification.
- Rate limiting.
- Tests de auth/enrollments/flujo compra.
- Admin de ordenes/pagos si entra en MVP.
- Documentacion final de deploy y README.
- Contenido/imagenes definitivas.

### Bugs conocidos

- Riesgo de usuario post-compra sin password y sin flujo guiado suficientemente claro.
- Login no bloquea email no verificado.
- `.env.example` incompleto para setup real.
- Documentacion historica desactualizada y con encoding roto.
- Cloudinary documentado pero no implementado.

### Proximos pasos recomendados

1. Abrir un chat de Planning/Architecture para cerrar decisiones de MVP: post-compra, email verification, alcance de admin, deploy.
2. Abrir un chat de Backend/API/Prisma para QA de Mercado Pago, env vars, tests y schema/migrations.
3. Abrir un chat de Auth/Access para verificar registro, reset, verification y acceso post-compra.
4. Abrir un chat de Frontend para UX post-compra, estados vacios, copy y encoding.
5. Abrir un chat de Testing/QA para checklist y automatizacion minima.
6. Abrir un chat de Deploy para Vercel/DB/webhooks/env.
7. Abrir un chat de Documentation para README, ARCHITECTURE_DECISIONS y AUTH_MVP_PLAN.

### Chats separados sugeridos para Codex Desktop

- **Planning / Architecture**: decidir alcance final del MVP, reglas de acceso post-compra, email verification y prioridades.
- **Frontend**: UX post-checkout, copy, encoding, estados vacios, responsive final.
- **Backend / API / Prisma**: Mercado Pago, orders, enrollments, env vars, migraciones y repos/use-cases.
- **Auth / Access**: registro, login, verification, reset, proteccion de rutas y cuenta creada por compra.
- **Testing / QA**: unit tests faltantes, checklist manual, smoke build/lint/test.
- **Deploy**: Vercel, PostgreSQL, secrets, webhook publico, dominios y callbacks.
- **Documentation**: README real, actualizacion de decisiones y plan MVP.
