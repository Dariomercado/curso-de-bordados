# Reglas permanentes del proyecto

## Arquitectura

- Mantener una arquitectura simple y escalable.
- Separar claramente `layout`, `sections`, `ui`, `data`, `types` y `lib`.
- No mezclar responsabilidades entre componentes.

## Implementación

- No usar Server Actions.
- No instalar librerías sin una justificación clara.
- No refactorizar archivos no relacionados con la tarea actual.
- No copiar literalmente el HTML demo; usarlo solo como referencia visual.

## Datos

- No mezclar datos mock dentro de los componentes.
- Mantener los datos en archivos separados dentro de `src/data`.

## UI y frontend

- Priorizar semántica HTML correcta.
- Priorizar accesibilidad.
- Usar `next/image` para imágenes.
- Usar `next/font` para tipografías.
- Escribir TypeScript claro, simple y mantenible.
- Evitar lógica innecesaria en componentes de presentación.

## Estilo de trabajo

- Implementar por etapas pequeñas y auditables.
- Mantener naming claro y profesional.
- Priorizar legibilidad y mantenimiento sobre complejidad innecesaria.
