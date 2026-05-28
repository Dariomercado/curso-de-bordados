# Prompt 05 — Páginas internas

Antes de implementar esta tarea, revisá estos archivos:

- `context-ai/01-project-overview.md`
- `context-ai/02-rules.md`
- `context-ai/03-architecture.md`
- `context-ai/04-roadmap.md`
- `context-ai/06-ui-guidelines.md`
- `context-ai/07-codex-workflow.md`

Usá como referencia visual la home ya implementada para mantener consistencia de diseño.

---

## Tarea

Quiero comenzar la siguiente fase del proyecto: páginas internas.

Antes de comenzar, realizá esta pequeña limpieza:

- eliminar cualquier código innecesario o residual
- en particular, eliminar `void FeaturedCoursesSection;` de `FeaturedKitsSection.tsx`

No modifiques otras secciones ya implementadas.

---

## Implementá

1. página `/cursos`
2. página `/cursos/[slug]`
3. página `/sobre-mi`

---

## Objetivo

- extender el proyecto a navegación real entre páginas
- mantener consistencia visual con la home
- reutilizar al máximo los componentes existentes
- mantener arquitectura limpia y escalable

---

## Requisitos

- reutilizar componentes existentes cuando tenga sentido
- crear nuevos componentes solo si realmente aportan claridad
- usar datos mock desde `src/data`
- mantener separación clara entre UI, sections, data y types

---

## Detalle por página

### `/cursos`

- mostrar listado completo de cursos
- reutilizar `CourseCard`
- usar una grilla consistente con la home
- incluir título de página claro

---

### `/cursos/[slug]`

- crear página dinámica con App Router
- usar params correctamente tipados
- mostrar:
  - título
  - descripción
  - nivel
  - duración
  - precio
  - contenido
  - CTA

- no duplicar lógica de datos
- obtener curso desde `src/data`

---

### `/sobre-mi`

- página editorial, cálida y simple
- reutilizar estilos y lógica de `AboutPreviewSection`
- evitar diseño corporativo
- priorizar lectura y aire visual

---

## Criterios de implementación

- usar App Router correctamente (`app/cursos/page.tsx`, `app/cursos/[slug]/page.tsx`)
- no mezclar lógica dentro de componentes UI
- evitar sobreabstracción
- mantener semántica HTML correcta
- mantener diseño responsive

---

## Importante

- no agregar backend todavía
- no agregar autenticación
- no implementar pagos
- no instalar librerías nuevas
- no refactorizar partes no relacionadas sin necesidad clara
- no modificar la home existente salvo la limpieza indicada
