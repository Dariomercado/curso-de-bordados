# Prompt 03 — Propuesta de valor y cursos destacados

Antes de implementar esta tarea, revisá estos archivos:

- `context-ai/02-rules.md`
- `context-ai/03-architecture.md`
- `context-ai/04-roadmap.md`
- `context-ai/05-home-reference.md`
- `context-ai/06-ui-guidelines.md`
- `context-ai/07-codex-workflow.md`

Usá como referencia visual complementaria:

- `context-ai/reference/stitch-home-demo.html`
- imágenes de propuesta de valor y cursos destacados dentro de `context-ai/reference/`

## Tarea

Sobre la base ya creada, quiero seguir implementando la home por secciones reutilizables.

## En esta fase implementá

1. `src/components/ui/FeatureCard.tsx`
2. `src/components/ui/CourseCard.tsx`
3. `src/components/ui/SectionHeading.tsx`
4. `src/components/sections/ValuePropositionSection.tsx`
5. `src/components/sections/FeaturedCoursesSection.tsx`

## Además

- crear los archivos de datos mock necesarios en `src/data`
- crear tipos básicos necesarios
- actualizar `src/app/page.tsx` para renderizar estas secciones debajo del `HeroSection`

## Requisitos

- mantener la arquitectura modular
- usar `SectionHeading` en las secciones que lo necesiten
- usar `FeatureCard` para los bloques de propuesta de valor
- usar `CourseCard` para cards de cursos destacados
- diseño responsive
- estética coherente con el hero ya implementado
- semántica HTML correcta
- código simple y mantenible

## Importante

- no tocar componentes ya existentes salvo necesidad real
- no instalar librerías nuevas
- mantener el contenido mock separado de la UI
- no introducir abstracciones innecesarias
