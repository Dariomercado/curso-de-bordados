> **Documento historico / parcialmente desactualizado.**
>
> Este archivo conserva decisiones iniciales de arquitectura. Para el estado vigente del MVP v1, usar `PROJECT_STATE.md` como fuente de verdad. En particular, el MVP v1 ya incluye auth, email transaccional, Mercado Pago y fulfillment por webhook `merchant_order`; Cloudinary, Server Actions, CMS, editor de cursos y admin avanzado quedan fuera del MVP v1.

---

# 📄 ARCHITECTURE_DECISIONS.md

## 1. Objetivo del sistema

Construir una plataforma web para **ofrecer, presentar y vender cursos digitales**, con una experiencia simple, clara y humana.

El sistema debe permitir:

- mostrar cursos
- detallar contenido
- capturar leads
- gestionar usuarios y autenticación
- prepararse para venta de cursos y kits
- evolucionar hacia acceso autenticado a contenidos

---

## 2. Enfoque general

Se adopta una arquitectura **monolítica modular** basada en Next.js.

Esto implica:

- frontend y backend en el mismo proyecto
- separación lógica por módulos (no por servicios)
- escalabilidad progresiva sin sobreingeniería

---

## 3. Stack tecnológico

### Core

- Next.js (App Router)
- TypeScript
- Tailwind CSS

### Backend (dentro de Next.js)

- Route Handlers (`/app/api/...`)
- NO se utilizarán Server Actions

### Base de datos

- PostgreSQL

### ORM

- Prisma

### Autenticación

- Auth.js

### Media

- Cloudinary

### Futuro (no en MVP)

- proveedor de pagos
- email transaccional
- analytics avanzado

---

## 4. Estructura del proyecto

```text
src/
  app/
  components/
  features/
    auth/
    courses/
    orders/
    admin/
    contact/
  lib/
    db/
    auth/
    validations/
    permissions/
    errors/
  server/
    repositories/
    use-cases/
```

### Criterios

- UI separada de lógica
- lógica separada de acceso a datos
- evitar lógica compleja en `page.tsx`
- centralizar lógica de negocio en `server/use-cases`

---

## 5. Modelo de datos (MVP)

### User

- id
- name
- email
- passwordHash
- image
- role (`ADMIN | STUDENT`)
- isActive
- createdAt
- updatedAt

### Course

- id
- slug
- title
- subtitle
- shortDescription
- description
- longDescription
- price
- level
- duration
- coverImage
- status (`DRAFT | PUBLISHED | ARCHIVED`)
- isFeatured
- createdAt
- updatedAt

### Lesson

- id
- courseId
- title
- content
- videoUrl
- position
- isPreview
- createdAt
- updatedAt

### Order

- id
- userId
- status (`PENDING | PAID | FAILED | REFUNDED | CANCELED`)
- total
- createdAt
- updatedAt

### PurchaseItem

- id
- orderId
- productId
- type (`COURSE | KIT`)
- title
- price
- quantity
- createdAt

### Enrollment

- id
- userId
- courseId
- accessGrantedAt
- createdAt

### ContactLead

- id
- name
- email
- phone
- message
- source
- createdAt

### Account

- id
- userId
- type
- provider
- providerAccountId
- refresh_token
- access_token
- expires_at
- token_type
- scope
- id_token
- session_state

### Session

- id
- sessionToken
- userId
- expires

### VerificationToken

- identifier
- token
- expires

---

## 6. Autenticación

Se implementará:

- login con email + contraseña
- sesiones seguras
- roles (admin / usuario)

### Reglas

- contraseñas hasheadas (bcrypt o similar)
- cookies httpOnly y secure
- mensajes de error neutros
- protección de rutas por rol
- separación clara entre rutas públicas y privadas

---

## 7. Manejo de imágenes

Se utilizará Cloudinary.

### Estrategia

- no guardar archivos en el servidor
- guardar solo referencias en DB (URL o public_id)
- usar CDN para entrega optimizada
- definir tamaños y transformaciones según contexto

---

## 8. Seguridad

### Backend

- validación de inputs con Zod como estándar del proyecto
- sanitización de datos
- rate limiting en login y formularios
- control de permisos por rol

### Estándar de validación

- Zod será el estándar para validación de inputs del sistema
- aplicar Zod en formularios, endpoints, autenticación y panel admin
- reutilizar schemas o validaciones derivadas cuando corresponda
- mantener mensajes claros y consistentes hacia UI y API

### Infra

- variables sensibles en `.env`
- uso de secretos seguros
- nunca exponer credenciales en frontend

### Archivos

- validar MIME real
- limitar tamaño de uploads
- renombrado seguro

---

## 9. Manejo de errores

### Usuario

- mensajes claros y humanos
- evitar errores técnicos visibles

### Sistema

- logs internos detallados
- respuestas consistentes desde API
- manejo centralizado de errores en `lib/errors`

---

## 10. Estrategia de evolución

### Fase actual (MVP)

- contenido estático + datos mock
- sin autenticación obligatoria
- sin pagos

### Fase 2

- base de datos real
- autenticación
- panel admin básico

### Fase 3

- pagos
- acceso a cursos
- progreso de usuario

---

## 11. Decisiones clave

✔ Next.js como fullstack
✔ Backend mediante Route Handlers (no Server Actions)
✔ PostgreSQL + Prisma como base de datos
✔ Auth.js para autenticación
✔ Cloudinary para media
✔ Admin propio (no CMS en MVP)
✔ Arquitectura simple, modular y escalable

---

## 12. Uso de Codex

Codex será utilizado para:

- generar schema Prisma
- crear endpoints (`/api`)
- scaffolding de auth
- panel admin básico
- refactors de código

Codex **no define arquitectura**, solo implementa.

---

## 13. Principios del proyecto

- simplicidad sobre complejidad
- claridad sobre abstracción prematura
- control total del sistema
- evolución por etapas
- experiencia de usuario como prioridad
