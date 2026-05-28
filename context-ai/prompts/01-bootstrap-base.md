# Prompt 01 — Bootstrap base del proyecto

Antes de implementar esta tarea, revisá estos archivos:

- `context-ai/01-project-overview.md`
- `context-ai/02-rules.md`
- `context-ai/03-architecture.md`
- `context-ai/04-roadmap.md`
- `context-ai/07-codex-workflow.md`

Usá como referencia visual complementaria:

- `context-ai/05-home-reference.md`
- `context-ai/reference/stitch-home-demo.html`
- imágenes dentro de `context-ai/reference/`

## Tarea

Quiero iniciar un proyecto profesional usando Next.js App Router, TypeScript y Tailwind CSS para una marca de bordado artesanal.

## Objetivo de esta fase

- preparar la base del proyecto
- definir una arquitectura limpia y escalable
- no implementar todavía toda la home
- dejar el proyecto listo para construir la home por secciones

## Contexto

El sitio será para una emprendedora que vende cursos online de bordado y kits de bordado. La estética debe ser artesanal, cálida, elegante y minimalista. El HTML demo existente debe usarse solo como referencia visual, no debe copiarse literalmente.

## Reglas

- usar Next.js App Router
- usar TypeScript
- usar Tailwind CSS correctamente, no por CDN
- usar `next/font` para tipografías
- no usar server actions
- no crear backend todavía
- no crear autenticación
- no crear pagos aún
- priorizar semántica, mantenibilidad y buenas prácticas
- separar datos mock de la UI
- no instalar librerías innecesarias
- no tocar archivos no relacionados con esta tarea

## Quiero que implementes

1. estructura de carpetas base dentro de `src`
2. `src/app/layout.tsx`
3. `src/app/globals.css`
4. componentes base:
   - `Container`
   - `SiteHeader`
   - `Button`
5. archivos mock iniciales:
   - `navigation.ts`
   - `hero.ts`
6. tipos básicos para navegación y hero
7. una página `src/app/page.tsx` mínima que renderice `SiteHeader` y deje lista la estructura para seguir

## Lineamientos visuales

- estética cálida, artesanal y delicada
- contenedores anchos pero elegantes
- spacing amplio
- tipografía refinada
- base neutra para luego seguir construyendo

## Importante

- mantener el código simple y claro
- no sobrecomplicar la lógica
- no refactorizar partes no relacionadas
- dejar todo listo para implementar `HeroSection` en el siguiente paso
