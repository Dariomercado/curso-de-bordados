import type { Kit } from "@/types/kit";

export const featuredKitsSection = {
  eyebrow: "Materiales curados",
  title: "Nuestros kits",
  description:
    "Todo lo que necesitás en una caja hermosa, lista para que empieces a bordar apenas la recibas.",
  kits: [
    {
      title: "Kit Inicial Completo",
      description:
        "Incluye bastidor, lino, agujas, hilos y una guía amable para empezar desde cero.",
      price: "$3.200",
      href: "/kits/kit-inicial-completo",
      image: {
        src: "/kit-starter.svg",
        alt: "Kit de bordado con bastidor y una rueda de hilos de colores.",
      },
    },
    {
      title: "Kit Flores de Campo",
      description:
        "Una selección delicada de materiales florales, patrón impreso y paleta suave de hilos.",
      price: "$3.800",
      href: "/kits/kit-flores-de-campo",
      image: {
        src: "/kit-floral.svg",
        alt: "Kit floral con caja ilustrada, hilos pastel y tijeras pequeñas.",
      },
    },
    {
      title: "Kit Geométrico",
      description:
        "Diseño contemporáneo con formas limpias, contrastes suaves y materiales premium.",
      price: "$3.500",
      href: "/kits/kit-geometrico",
      image: {
        src: "/kit-geometric.svg",
        alt: "Bastidor con composición geométrica bordada en tonos azules y arena.",
      },
    },
  ] satisfies Kit[],
};
