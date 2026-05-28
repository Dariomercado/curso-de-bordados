# Flujo de trabajo con Codex

## Referencias obligatorias antes de implementar

Antes de proponer o generar cambios, revisar siempre:

1. `PROJECT_STATE.md` para entender el estado actual del proyecto
2. `ARCHITECTURE_DECISIONS.md` para respetar las decisiones estructurales
3. `prisma/schema.prisma` para usar el modelo de datos real vigente

No asumir arquitectura, entidades o relaciones fuera de esas fuentes sin justificarlo explícitamente.

## Reglas de ejecución

- Resolver una tarea por vez.
- No modificar archivos no relacionados.
- Mantener cambios pequeños y auditables.
- Reutilizar componentes existentes antes de crear nuevos.
- Confirmar naming y ubicación de archivos según la arquitectura definida.
- Toda validación nueva de inputs debe usar Zod por defecto, salvo justificación explícita.

## Orden de implementación

1. Base del proyecto
2. Header + Hero
3. Propuesta de valor + cursos destacados
4. About + kits
5. Benefits + testimonials + CTA + footer
6. Páginas internas

## Antes de cerrar una tarea

Verificar:

- semántica
- responsive
- consistencia visual
- separación data/UI
- claridad del código
