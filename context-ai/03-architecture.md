# Arquitectura del proyecto

## Estructura principal

src/
app/
components/
layout/
sections/
ui/
data/
lib/
types/

## Criterio

### layout

Componentes estructurales globales:

- SiteHeader
- SiteFooter
- Container

### sections

Bloques grandes de página:

- HeroSection
- ValuePropositionSection
- FeaturedCoursesSection
- AboutPreviewSection
- FeaturedKitsSection
- BenefitsSection
- TestimonialsSection
- FinalCtaSection

### ui

Piezas reutilizables:

- Button
- SectionHeading
- CourseCard
- KitCard
- FeatureCard
- TestimonialCard
- ThreadAccent
- BlobDecoration

### data

Datos mock separados por entidad.

### types

Tipos compartidos del dominio y de UI.
