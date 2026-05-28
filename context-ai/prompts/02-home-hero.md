# Prompt 02 — Hero de la home

Antes de implementar esta tarea, revisá estos archivos:

- `context-ai/01-project-overview.md`
- `context-ai/02-rules.md`
- `context-ai/03-architecture.md`
- `context-ai/04-roadmap.md`
- `context-ai/05-home-reference.md`
- `context-ai/06-ui-guidelines.md`
- `context-ai/07-codex-workflow.md`

Usá como referencia visual complementaria:

- `context-ai/reference/stitch-home-demo.html`
- imágenes dentro de `context-ai/reference/`, especialmente las del header y hero

## Tarea

Sobre la base ya creada del proyecto, quiero que implementes correctamente la sección Hero de la home.

Importante: actualmente `src/app/page.tsx` ya contiene un bloque inicial que funciona como una primera versión del hero. No quiero que rehagas la home desde cero ni que dupliques estructura. Quiero que tomes esa base existente, la extraigas y la conviertas en un componente de sección reutilizable, mejorando su implementación y alineándola con la arquitectura definida del proyecto.

## Objetivo

- crear un `HeroSection` reutilizable y limpio
- partir de la base visual ya existente en `src/app/page.tsx`
- mover la lógica/presentación actual del hero a `src/components/sections/HeroSection.tsx`
- dejar `src/app/page.tsx` como ensamblador simple de secciones
- mantener consistencia con la arquitectura ya creada
- usar datos mock desde `src/data/hero.ts`
- usar `next/image`
- mantener semántica y responsive design

## Quiero que implementes

1. `src/components/sections/HeroSection.tsx`
2. si hace falta, crear:
   - `SectionHeading` solo si realmente aporta
   - `ThreadAccent` como componente decorativo SVG reutilizable
3. actualizar `src/app/page.tsx` para renderizar el `HeroSection` debajo del `SiteHeader`
4. refactorizar el bloque actual del hero sin rehacer innecesariamente lo que ya funciona

## Contenido esperado del Hero

- badge o eyebrow pequeño
- título principal
- subtítulo
- dos botones CTA:
  - Ver cursos
  - Comprar kits
- bloque visual con imagen
- pequeño detalle decorativo inspirado en hilo de bordado, sutil y elegante

## Lineamientos visuales

- hero cálido, delicado, aireado
- estética artesanal premium
- sin apariencia SaaS
- bordes suaves
- composición equilibrada entre texto e imagen
- responsive en mobile, tablet y desktop

## Importante

- no hardcodear los textos dentro del componente si ya están en `hero.ts`
- no sobrecomplicar la lógica
- no agregar animaciones complejas todavía
- mantener el componente preparado para futuras mejoras
- no modificar componentes no relacionados salvo necesidad real
- reutilizar la base actual antes de crear una versión completamente nueva
