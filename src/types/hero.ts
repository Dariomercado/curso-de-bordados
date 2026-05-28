export type HeroAction = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
};

export type HeroImage = {
  src: string;
  alt: string;
};

export type HeroHighlight = {
  quote: string;
  author: string;
};

export type HeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  actions: HeroAction[];
  image: HeroImage;
  highlight: HeroHighlight;
};
