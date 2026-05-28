import Image from "next/image";
import { Container } from "@/components/layout/Container";
import type { BenefitItem, BenefitIcon, BenefitTone } from "@/types/benefit";

type BenefitsSectionProps = {
  title: string;
  description: string;
  cards: BenefitItem[];
  highlight: {
    title: string;
    description: string;
    image: {
      src: string;
      alt: string;
    };
  };
};

const toneClasses: Record<BenefitTone, string> = {
  neutral: "bg-surface-strong text-foreground border border-border/70",
  sage: "bg-[rgb(94,115,74)] text-white",
  brand: "bg-brand text-white",
  terracotta: "bg-[rgb(164,120,70)] text-white",
};

function BenefitIconSvg({ icon }: { icon: BenefitIcon }) {
  if (icon === "steps") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-10 w-10">
        <path
          d="M7 16.5L10.5 13L12.5 15L9 18.5L7 16.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M11.5 12L15 8.5L17 10.5L13.5 14L11.5 12Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "clock") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-10 w-10">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 7.5V12L15.5 14.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-10 w-10">
      <path
        d="M8 16.5L4.5 20M10.5 8.5L19.5 17.5M12 7L16.5 2.5L21.5 7.5L17 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 7.5C7.5 7.5 8.5 8.5 8.5 10.5C8.5 12.5 7.5 13.5 5.5 13.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BenefitCard({ item }: { item: BenefitItem }) {
  return (
    <article
      className={`flex min-h-[270px] flex-col items-center justify-center rounded-[2rem] p-8 text-center shadow-soft ${toneClasses[item.tone]}`}
    >
      {item.icon ? <BenefitIconSvg icon={item.icon} /> : null}
      <h3 className="mt-6 font-heading text-3xl leading-tight">{item.title}</h3>
      <p className="mt-4 max-w-[18rem] text-base leading-7 opacity-90">
        {item.description}
      </p>
    </article>
  );
}

export function BenefitsSection({
  title,
  description,
  cards,
  highlight,
}: BenefitsSectionProps) {
  return (
    <section className="py-16 sm:py-20 lg:py-24" aria-labelledby="benefits-heading">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.55fr_0.55fr]">
          <article className="rounded-[2rem] border border-border/70 bg-surface-strong p-8 shadow-soft sm:p-10">
            <h2
              id="benefits-heading"
              className="font-heading text-4xl leading-tight text-foreground sm:text-5xl"
            >
              {title}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-foreground-muted sm:text-lg">
              {description}
            </p>
          </article>

          {cards.slice(0, 2).map((item) => (
            <BenefitCard key={item.title} item={item} />
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.55fr_1.45fr]">
          <BenefitCard item={cards[2]} />

          <article className="grid items-center gap-8 rounded-[2rem] bg-[rgba(226,214,205,0.86)] p-8 shadow-soft sm:p-10 lg:grid-cols-[1fr_420px]">
            <div>
              <h3 className="font-heading text-4xl leading-tight text-foreground">
                {highlight.title}
              </h3>
              <p className="mt-5 max-w-xl text-base leading-8 text-foreground-muted sm:text-lg">
                {highlight.description}
              </p>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-border/60 shadow-soft">
              <Image
                src={highlight.image.src}
                alt={highlight.image.alt}
                width={820}
                height={480}
                className="aspect-[16/9] h-auto w-full object-cover"
              />
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}
