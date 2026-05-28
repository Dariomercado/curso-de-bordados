# 00 - Project Sources of Truth

Este archivo define cuáles son las fuentes principales de verdad del proyecto y cómo deben usarse.

## Archivos principales

### 1. `PROJECT_STATE.md`

Describe el estado actual real del proyecto.

Usar este archivo para entender:

- estructura actual de carpetas
- páginas ya construidas
- componentes existentes
- estado del frontend
- fuentes de datos actuales
- funcionalidades implementadas
- pendientes técnicos ya detectados

Este archivo representa **cómo está hoy el proyecto**.

---

### 2. `ARCHITECTURE_DECISIONS.md`

Define las decisiones estructurales y arquitectónicas del sistema.

Usar este archivo para entender:

- stack tecnológico elegido
- enfoque general del sistema
- criterios de arquitectura
- modelo conceptual de datos
- decisiones sobre backend
- autenticación
- seguridad
- manejo de media
- evolución por etapas

Este archivo representa **cómo debe construirse el proyecto**.

---

### 3. `prisma/schema.prisma`

Es la definición actual del modelo de datos real del sistema.

Usar este archivo para entender:

- entidades reales
- enums
- relaciones
- restricciones
- estructura de base de datos
- compatibilidad con Prisma y Auth.js

Este archivo representa **la fuente de verdad del modelo de datos**.

---

## Prioridad de interpretación

Cuando exista diferencia entre archivos:

- `PROJECT_STATE.md` = estado actual implementado
- `ARCHITECTURE_DECISIONS.md` = intención arquitectónica
- `prisma/schema.prisma` = fuente de verdad para datos y relaciones

### Regla importante

No proponer cambios que contradigan estas fuentes sin explicarlo explícitamente.

### Regla para implementación

Antes de generar código nuevo:

1. revisar el estado actual en `PROJECT_STATE.md`
2. revisar las decisiones en `ARCHITECTURE_DECISIONS.md`
3. revisar el modelo real en `prisma/schema.prisma`

---

## Criterio de trabajo

- no improvisar arquitectura
- no asumir modelos de datos distintos al schema
- no romper estructura existente sin justificación
- priorizar consistencia con el estado actual del proyecto
- proponer cambios incrementales y claros

### 4. `AUTH_MVP_PLAN.md`

Define el alcance funcional del sistema en su etapa actual (MVP).

Usar este archivo para entender:

- qué funcionalidades están dentro del MVP
- qué módulos deben implementarse
- qué queda fuera de alcance por ahora
- cómo se estructuran auth, panel de usuario y panel admin

Este archivo representa **qué debe construirse en esta etapa del proyecto**.
