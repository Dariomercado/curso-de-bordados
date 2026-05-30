# Project State - MVP v1

> Fuente de verdad actual para continuar el proyecto en Codex Desktop.
> Estado actualizado para cierre MVP v1 y preparacion de subida a GitHub.
> Fecha de actualizacion: 2026-05-30.

## 1. Resumen ejecutivo

`PROJECT_STATE.md` es la fuente de verdad operativa del proyecto. Si `ARCHITECTURE_DECISIONS.md`, `AUTH_MVP_PLAN.md` u otros documentos historicos contradicen este archivo, prevalece este archivo.

El proyecto es una aplicacion fullstack en Next.js App Router para presentar y vender cursos digitales de bordado. El MVP v1 incluye sitio publico, cursos desde base de datos, autenticacion, aula privada, panel admin operativo, checkout Mercado Pago, fulfillment por webhook, email transaccional, rate limiting minimo y tests automatizados.

No se va a desplegar todavia. El proximo paso operativo es subir el proyecto a GitHub con documentacion segura y sin secretos.

## 2. Validacion final MVP v1

Validacion final verde:

- `npm run lint` pasa con 1 warning no bloqueante.
- `npm run test:run` pasa: 16 files, 53 tests.
- `npm run build` pasa y genera 35 paginas.

Notas:

- El warning de lint no bloquea el cierre MVP v1.
- La validacion se documenta como estado de cierre; no reemplaza una futura validacion pre-deploy.

## 3. Decisiones MVP v1 vigentes

- **Compra guest permitida:** el checkout puede iniciarse y completarse sin sesion activa. La orden conserva `buyerEmail` y puede tener `userId` opcional.
- **Fulfillment por webhook Mercado Pago:** el otorgamiento de acceso no depende del redirect del navegador. La fuente de verdad para fulfillment es el webhook de Mercado Pago con `merchant_order`; las notificaciones `payment` no otorgan acceso por si solas.
- **Post-compra guest cerrado:** si el email de compra no existe, el fulfillment crea un usuario `STUDENT` sin password usable y asigna el enrollment. Si el email ya existe, asocia compra/enrollment a ese usuario.
- **Activacion de acceso:** compradores creados sin `passwordHash` activan acceso usando el flujo existente de recuperar/restablecer contrasena.
- **Email "Activa tu acceso":** backend envia un email de activacion cuando la compra crea o encuentra un usuario sin `passwordHash`.
- **Email verification no bloqueante:** `emailVerifiedAt` no bloquea login ni acceso en MVP v1.
- **Admin MVP operativo, no editorial:** el admin sirve para operacion basica: leads, usuarios, cursos visibles y gestion minima de enrollments. No es CMS ni editor de cursos.
- **Rate limiting minimo:** existe proteccion minima para endpoints publicos sensibles.
- **No Server Actions:** el backend se mantiene mediante Route Handlers, use-cases y repositories.

## 4. Fuera del MVP v1

Quedan fuera de MVP v1:

- CMS.
- Editor de cursos/contenido.
- Admin avanzado.
- Gestion avanzada de ordenes/pagos.
- Refunds automaticos.
- Cloudinary/media pipeline.
- Server Actions.
- Analytics avanzado.
- Deploy productivo.
- Automatizaciones complejas de pagos.

## 5. Stack confirmado

- Next.js `16.2.1` con App Router en `src/app`.
- React `19.2.4` y React DOM `19.2.4`.
- TypeScript estricto.
- Tailwind CSS 4 con `@tailwindcss/postcss`.
- PostgreSQL.
- Prisma 7 (`@prisma/client`, `prisma`, `@prisma/adapter-pg`, `pg`).
- Auth.js mediante `next-auth` v4 + `@auth/prisma-adapter`.
- Zod para validacion.
- `bcryptjs` para password hashing.
- React Email + Resend para email transaccional.
- Mercado Pago integrado por HTTP/fetch propio, sin SDK directo `mercadopago`.
- Vitest + Testing Library + jsdom para tests.
- Docker Compose para PostgreSQL local.

## 6. Rutas y modulos implementados

### Publico / marketing

- `/`: home.
- `/cursos`: listado de cursos publicados desde Prisma.
- `/cursos/[slug]`: detalle de curso publicado con CTA segun sesion/enrollment.
- `/sobre-mi`: pagina editorial estatica.
- `/contacto`: pagina con formulario conectado a `/api/contact`.

### Auth y cuenta

- `/login`: login con credenciales.
- `/registro`: registro publico de estudiante.
- `/verificar-email`: resultado de verificacion.
- `/recuperar-contrasena`: solicitud de reset/activacion.
- `/restablecer-contrasena`: nueva contrasena con token.
- `/mi-cuenta`: area privada basica.
- `/mis-cursos`: cursos asignados.
- `/mis-cursos/[slug]`: aula privada por enrollment.

### Admin

- `/admin`: dashboard minimo.
- `/admin/leads`: leads de contacto.
- `/admin/usuarios`: estudiantes y gestion minima de enrollments.
- `/admin/cursos`: vista basica de cursos y accesos.

### Checkout

- `/checkout/success`
- `/checkout/pending`
- `/checkout/failure`

Estas paginas son retornos UX. El acceso real se otorga por webhook/fulfillment, no por redirect.

## 7. APIs y backend implementados

### Auth

- `GET/POST /api/auth/[...nextauth]` via Auth.js.
- `POST /api/auth/register`.
- `POST /api/auth/email/resend`.
- `GET /api/auth/email/verify`.
- `POST /api/auth/password/forgot`.
- `POST /api/auth/password/reset`.

### Contacto

- `POST /api/contact` valida con Zod, aplica rate limiting y persiste `ContactLead`.

### Admin enrollments

- `POST /api/admin/enrollments` asigna acceso a curso publicado.
- `DELETE /api/admin/enrollments/[id]` revoca acceso.

### Pagos Mercado Pago

- `POST /api/payments/mercadopago/checkout` crea orden `PENDING`, crea preferencia en Mercado Pago y devuelve init points.
- `POST /api/payments/mercadopago/webhook` procesa notificaciones; fulfillment por `merchant_order`.
- `finalizePaidOrder` valida estado, moneda ARS, monto y external reference; marca orden `PAID`, crea/asocia usuario por email, crea enrollment y dispara activacion si falta `passwordHash`.

## 8. Rate limiting minimo

Hay rate limiting minimo para superficies publicas sensibles:

- login por credenciales/Auth.js;
- registro;
- reenvio de verificacion;
- forgot password;
- reset password;
- contacto;
- checkout Mercado Pago.

El webhook de Mercado Pago no tiene rate limiting generico agresivo para no bloquear reintentos legitimos; se protege con validacion de firma y reglas propias del flujo.

## 9. Modelo de datos

`prisma/schema.prisma` es la fuente de verdad del modelo.

Modelos principales:

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

Enums principales:

- `UserRole`
- `AuthTokenType`
- `CourseStatus`
- `OrderStatus`
- `ProductType`

Notas relevantes:

- `User` incluye `emailVerifiedAt` y `authTokens`.
- `Order` soporta compra guest con `buyerEmail` y `userId` opcional.
- `AuthToken` se usa para verificacion de email y reset/activacion de password.

## 10. Datos y contenido

Usan DB real con Prisma:

- cursos publicados/destacados;
- detalle de curso;
- lecciones/aula privada;
- usuarios;
- sesiones/cuentas Auth.js;
- tokens de auth;
- enrollments;
- ordenes y purchase items;
- leads de contacto;
- admin basico.

Siguen como contenido estatico/editorial en `src/data`:

- navegacion;
- hero;
- propuesta de valor;
- textos editoriales;
- sobre mi;
- kits como contenido/editorial;
- beneficios;
- testimonios;
- CTA final;
- footer;
- contenido editorial de contacto.

## 11. Variables de entorno

`.env.example` esta preparado para GitHub/futuro deploy con placeholders seguros. No contiene secretos.

Grupos de variables:

- Base de datos: `DATABASE_URL`.
- Auth.js/NextAuth: `NEXTAUTH_SECRET`.
- URLs publicas: `NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL`, `AUTH_EMAIL_BASE_URL`.
- Email transaccional: `AUTH_EMAIL_PROVIDER`, `RESEND_API_KEY`, `AUTH_EMAIL_FROM`, `AUTH_EMAIL_REPLY_TO`.
- Mercado Pago: `MERCADO_PAGO_ACCESS_TOKEN`, `NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY`, `MERCADO_PAGO_WEBHOOK_SECRET`.
- Local/dev: `MERCADO_PAGO_ALLOW_UNSIGNED_WEBHOOK_DEV`.

La `.env` real no debe subirse al repo.

## 12. Documentacion historica

- `ARCHITECTURE_DECISIONS.md` queda como documento historico de decisiones iniciales. Contiene partes desactualizadas frente al MVP v1, especialmente Cloudinary, pagos/email como futuro y fases anteriores.
- `AUTH_MVP_PLAN.md` queda como plan historico de auth inicial. Esta desactualizado frente al MVP v1 porque el proyecto ya tiene registro, recuperacion/reset, email verification, pagos, webhook y asignacion automatica de acceso.

## 13. Estado para GitHub

Listo para preparar subida a GitHub con estas condiciones:

- No subir `.env` real ni secretos.
- Mantener `.env.example` como referencia segura.
- Versionar documentacion actualizada.
- Confirmar `git status` antes de commit para revisar archivos no trackeados o generados.
- No desplegar todavia.

## 14. Proximos pasos recomendados

1. Revisar `git status` y confirmar archivos a commitear.
2. Subir a GitHub sin secretos.
3. En una etapa futura, preparar deploy: dominio, base PostgreSQL productiva, variables reales, Mercado Pago sandbox/produccion, webhook publico y QA post-deploy.
4. Mantener `PROJECT_STATE.md` como fuente de verdad hasta una nueva actualizacion de estado.
