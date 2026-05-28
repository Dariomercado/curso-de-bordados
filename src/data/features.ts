import type { FeatureItem } from "@/types/feature";

export const featuresSection = {
  items: [
    {
      icon: "play",
      title: "Cursos online",
      description:
        "Lecciones en video de alta calidad que podés ver a tu ritmo, desde cualquier dispositivo y para siempre.",
    },
    {
      icon: "kit",
      title: "Kits de bordado",
      description:
        "Curamos los mejores materiales: hilos de algodón, telas nobles y diseños exclusivos listos para bordar.",
    },
    {
      icon: "heart",
      title: "Acompañamiento",
      description:
        "No estás sola. Respondemos tus dudas y formamos parte de una comunidad creativa vibrante.",
    },
  ] satisfies FeatureItem[],
};
