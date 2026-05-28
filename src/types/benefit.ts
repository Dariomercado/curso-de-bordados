export type BenefitTone = "neutral" | "sage" | "brand" | "terracotta";

export type BenefitIcon = "steps" | "clock" | "thread";

export type BenefitItem = {
  title: string;
  description: string;
  tone: BenefitTone;
  icon?: BenefitIcon;
};
