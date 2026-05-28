import type { HeroContent } from "@/types/hero";

export const heroContent: HeroContent = {
  eyebrow: "Hecho a mano con amor",
  title: "Aprendé el arte del bordado con una experiencia cálida y guiada.",
  description:
    "Cursos online paso a paso y kits curados con delicadeza para que puedas crear con tus manos, a tu ritmo y desde casa.",
  actions: [
    {
      label: "Ver cursos",
      href: "/cursos",
      variant: "primary",
    },
  ],
  image: {
    src: "/hero-embroidery.svg",
    alt: "Bastidor de bordado con flores en tonos suaves sobre tela celeste.",
  },
  highlight: {
    quote:
      "Bordar se convirtió en mi momento de pausa diaria. Las clases se sienten claras, bellas y cercanas.",
    author: "Sofía R.",
  },
};

