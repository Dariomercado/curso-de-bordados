import type { BenefitItem } from "@/types/benefit";

export const benefitsSection = {
  title: "¿Por qué bordar con nosotros?",
  description:
    "Hemos diseñado una experiencia de aprendizaje que abraza a quien recién comienza y desafía a quien ya tiene experiencia.",
  cards: [
    {
      title: "Paso a paso",
      description: "Nadie se queda atrás. Explicamos cada puntada en detalle.",
      tone: "sage",
      icon: "steps",
    },
    {
      title: "A tu ritmo",
      description: "Acceso ilimitado. Mirá las clases cuando y donde quieras.",
      tone: "brand",
      icon: "clock",
    },
    {
      title: "Curaduría",
      description: "Seleccionamos materiales de calidad premium para vos.",
      tone: "terracotta",
      icon: "thread",
    },
  ] satisfies BenefitItem[],
  highlight: {
    title: "Ideal para principiantes",
    description:
      "No necesitás conocimientos previos. Solo ganas de crear algo hermoso con tus manos y un poco de hilo.",
    image: {
      src: "/benefits-beginner.svg",
      alt: "Manos bordando un bastidor simple con una ilustración textil.",
    },
  },
};
