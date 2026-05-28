# Prompt 04 — Resto de la home

Antes de implementar esta tarea, revisá estos archivos:

- `context-ai/02-rules.md`
- `context-ai/03-architecture.md`
- `context-ai/04-roadmap.md`
- `context-ai/05-home-reference.md`
- `context-ai/06-ui-guidelines.md`
- `context-ai/07-codex-workflow.md`

Usá como referencia visual complementaria:

- `context-ai/reference/stitch-home-demo.html`
- imágenes de about, kits, beneficios, testimonios, CTA final y footer dentro de `context-ai/reference/`

## Tarea

Continuemos con la home manteniendo la arquitectura actual.

Importante: `HeroSection`, `ValuePropositionSection` y `FeaturedCoursesSection` ya están implementadas y aprobadas. No quiero que rehagas ni modifiques esas secciones salvo necesidad técnica real. En esta fase quiero completar únicamente el resto de la home.

## Implementá

1. `src/components/ui/KitCard.tsx`
2. `src/components/ui/TestimonialCard.tsx`
3. `src/components/sections/AboutPreviewSection.tsx`
4. `src/components/sections/FeaturedKitsSection.tsx`
5. `src/components/sections/BenefitsSection.tsx`
6. `src/components/sections/TestimonialsSection.tsx`
7. `src/components/sections/FinalCtaSection.tsx`
8. `src/components/layout/SiteFooter.tsx`

## Además

- crear o completar los archivos de datos mock necesarios en `src/data`
- crear tipos en `src/types` solo si realmente hacen falta
- actualizar `src/app/page.tsx` para renderizar la home completa
- mantener `src/app/page.tsx` simple, solo como ensamblador de secciones

## Objetivo

- completar la home manteniendo la arquitectura modular ya definida
- reutilizar patrones visuales, spacing, tipografía y lenguaje de las secciones ya implementadas
- mantener separación clara entre UI, sections, data y types
- dejar la home completa, consistente y lista para pasar luego a páginas internas

## Requisitos

- mantener consistencia visual y estructural
- usar datos desde `src/data`
- mantener diseño artesanal, cálido y minimalista
- no sobrecomplicar los componentes
- seguir buenas prácticas de semántica y accesibilidad
- responsive correcto

## Criterios de implementación

- `AboutPreviewSection` debe sentirse editorial, cálida y cercana
- `FeaturedKitsSection` debe seguir el patrón de cursos destacados, pero adaptado a kits
- `BenefitsSection` debe resolver una grilla simple y clara, sin exceso visual
- `TestimonialsSection` debe sentirse creíble, humana y liviana
- `FinalCtaSection` debe cerrar la home con un bloque fuerte pero elegante
- `SiteFooter` debe ser simple, limpio y consistente con el resto del sitio
- reutilizar componentes existentes antes de crear nuevos
- evitar props innecesarias o abstracciones innecesarias

## Importante

- no instalar librerías nuevas
- no modificar archivos no relacionados salvo necesidad real
- no rehacer secciones ya aprobadas
- no implementar páginas internas todavía
- mantener claridad en naming y estructura
