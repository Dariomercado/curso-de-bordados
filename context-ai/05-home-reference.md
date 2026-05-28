# Home Reference

## Origen

Referencia visual basada en un HTML generado con Stitch.

Este HTML debe usarse únicamente como guía visual.
No debe copiarse ni adaptarse directamente en el código.

La implementación final debe seguir la arquitectura definida en:

- 03-architecture.md
- 02-rules.md

---

## Objetivo visual de la home

La home debe transmitir:

- calidez
- estética artesanal
- elegancia
- cercanía
- creatividad
- aprendizaje progresivo
- sensación premium pero humana
- mucho aire visual

No debe parecer:

- un SaaS
- una startup tecnológica
- un dashboard
- una landing agresiva de ventas

---

## Estructura de la home

Orden de secciones:

1. Header
2. Hero
3. Propuesta de valor (3 bloques)
4. Cursos destacados
5. Sobre mí
6. Kits destacados
7. Beneficios
8. Testimonios
9. CTA final
10. Footer

---

## Componentes reutilizables detectados

Estos elementos deben convertirse en componentes dentro de `/components/ui`:

- Button (primary / secondary)
- SectionHeading
- CourseCard
- KitCard
- FeatureCard (para propuesta de valor)
- TestimonialCard
- Container
- ThreadAccent (líneas tipo hilo)
- BlobDecoration (formas orgánicas)

---

## Sistema visual (tokens de diseño)

### Tipografía

- Headings:
  - serif elegante
  - carácter editorial
  - ligera inclinación o contraste
- Body:
  - sans serif limpia
  - legible
  - moderna pero neutra

### Paleta de colores

Base:

- crema / beige claro
- blanco roto

Acentos:

- rosa viejo suave
- terracota clara
- verde salvia

Neutros:

- gris cálido
- texto oscuro suave (no negro puro)

### Bordes

- bordes redondeados grandes
- sensación orgánica y amable
- evitar esquinas duras

### Sombras

- muy suaves
- difusas
- no duras ni marcadas

### Espaciado

- generoso
- aire entre bloques
- ritmo vertical claro

---

## Header

Características:

- navegación simple y limpia
- marca visible (tipografía elegante)
- CTA claro (“Ver cursos”)
- fondo claro con leve transparencia o blur opcional

No debe:

- saturarse de elementos
- parecer un navbar de SaaS

---

## Hero

Características:

- layout de 2 columnas (texto + imagen)
- título grande y dominante
- posible palabra destacada (color o estilo)
- subtítulo explicativo
- dos CTAs:
  - Ver cursos
  - Comprar kits
- imagen editorial (no stock genérico)

Decoración:

- blobs orgánicos suaves
- líneas tipo hilo (SVG) sutiles

No debe:

- estar sobrecargado
- usar animaciones agresivas

---

## Propuesta de valor

- 3 bloques horizontales
- cada bloque:
  - ícono
  - título
  - descripción

Componente: `FeatureCard`

Objetivo:
explicar rápidamente qué ofrece el sitio

---

## Cursos destacados

Cards con:

- imagen grande
- badge (nivel)
- título
- descripción breve
- precio
- CTA

Componente: `CourseCard`

Grid responsivo:

- 1 columna mobile
- 2 tablet
- 3 desktop

---

## Sobre mí

Sección editorial.

Debe transmitir:

- cercanía
- historia
- humanidad

Contenido:

- texto narrativo
- imagen real

Layout:

- puede alternar imagen/texto

No debe:

- parecer corporativo
- parecer genérico

---

## Kits destacados

Similares a cursos, pero más simples:

- imagen clara del producto
- nombre
- descripción breve
- precio
- CTA

Componente: `KitCard`

---

## Beneficios

- lista o grid
- 4–6 items
- íconos simples

Objetivo:
reducir fricción y reforzar decisión

---

## Testimonios

- cards simples
- texto breve
- nombre de persona
- opcional: avatar

Componente: `TestimonialCard`

Debe sentirse:

- real
- cercano
- creíble

---

## CTA final

- bloque visual destacado
- fondo con color de acento
- texto corto y claro
- CTA fuerte

Objetivo:
cerrar la conversión

---

## Footer

- branding
- texto corto
- navegación secundaria
- redes o contacto

Diseño:

- limpio
- liviano

---

## Recursos visuales

- blobs suaves orgánicos
- líneas tipo hilo (SVG)
- composición editorial
- imágenes reales (bordado, manos, materiales)

---

## SVG y elementos decorativos

Los elementos decorativos deben:

- ser sutiles
- no interferir con la legibilidad
- integrarse al layout
- no parecer ilustración infantil

Ejemplos:

- líneas curvas tipo hilo
- pequeños trazos bordados
- detalles en esquinas o separadores

Componente sugerido:

- `ThreadAccent`

---

## Responsive

Debe adaptarse correctamente a:

- mobile (prioridad)
- tablet
- desktop

Consideraciones:

- hero pasa a 1 columna en mobile
- grids se colapsan
- spacing se mantiene consistente
- CTAs accesibles sin scroll excesivo

---

## Reglas de implementación

- NO copiar HTML del demo
- usar el HTML solo como referencia visual
- respetar la arquitectura definida
- separar data y UI
- priorizar componentes reutilizables
- mantener consistencia visual entre secciones
- evitar sobreingeniería

---

## Objetivo final

Construir una home:

- visualmente coherente
- técnicamente escalable
- fácil de mantener
- alineada con una marca artesanal real

No construir solo una maqueta visual.
Construir base de producto real.
