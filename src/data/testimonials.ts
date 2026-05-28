import type { Testimonial } from "@/types/testimonial";

export const testimonialsSection = {
  eyebrow: "Testimonios reales",
  title: "Lo que cuentan quienes ya bordaron con nosotras",
  description:
    "Historias breves y honestas de alumnas que encontraron un ritmo creativo propio.",
  testimonials: [
    {
      quote:
        "Los kits son preciosos y vienen tan bien presentados que da pena abrirlos. Los cursos online son súper claros, aprendí más en una semana que en años sola.",
      author: "Mariana V.",
      role: "Alumna del curso inicial",
      avatar: {
        src: "/avatar-mariana.svg",
        alt: "Ilustración de Mariana sonriendo.",
      },
    },
    {
      quote:
        "Sentí que alguien realmente me acompañaba. Las explicaciones son suaves, precisas y hacen que el proceso se disfrute mucho más.",
      author: "Laura P.",
      role: "Alumna de diseños florales",
      avatar: {
        src: "/avatar-laura.svg",
        alt: "Ilustración de Laura con cabello corto y expresión amable.",
      },
    },
  ] satisfies Testimonial[],
};
