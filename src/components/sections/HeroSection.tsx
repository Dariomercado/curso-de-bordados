import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ThreadAccent } from "@/components/ui/ThreadAccent";
import type { HeroContent } from "@/types/hero";

type HeroSectionProps = {
  content: HeroContent;
};

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section aria-labelledby="hero-heading">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface px-6 py-10 shadow-soft backdrop-blur sm:px-8 sm:py-12 lg:px-14 lg:py-16">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-2/5 bg-[radial-gradient(circle_at_top,_rgba(217,192,169,0.25),_transparent_62%)] lg:block" />

          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:gap-10">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-brand/15 bg-surface-strong px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-brand">
                {content.eyebrow}
              </div>

              <h1
                id="hero-heading"
                className="mt-7 max-w-xl font-heading text-5xl leading-[0.94] text-balance text-foreground sm:text-6xl lg:text-7xl"
              >
                {content.title}
              </h1>

              <ThreadAccent className="mt-6 h-8 w-36" />

              <p className="mt-6 max-w-xl text-base leading-8 text-foreground-muted sm:text-lg">
                {content.description}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                {content.actions.map((action) => (
                  <Button
                    key={action.label}
                    href={action.href}
                    variant={action.variant}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[620px] lg:mx-0">
              <div className="absolute -right-6 top-10 h-56 w-56 rounded-full bg-[rgba(205,220,196,0.42)] blur-3xl sm:h-72 sm:w-72" />
              <div className="absolute -left-4 bottom-20 h-36 w-36 rounded-full bg-[rgba(217,192,169,0.32)] blur-3xl sm:h-48 sm:w-48" />

              <div className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-surface-strong shadow-soft">
                <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/10" />
                <Image
                  src={content.image.src}
                  alt={content.image.alt}
                  width={880}
                  height={980}
                  priority
                  className="aspect-[4/4.2] h-auto w-full object-cover"
                />
              </div>

              <aside className="relative -mt-10 ml-auto max-w-xs rounded-[1.75rem] border border-border bg-surface-strong p-5 shadow-soft sm:-mt-14 sm:mr-6 sm:p-6">
                <ThreadAccent tone="sage" className="h-6 w-24" />
                <p className="mt-4 font-heading text-[1.6rem] italic leading-8 text-foreground">
                  &ldquo;{content.highlight.quote}&rdquo;
                </p>
                <p className="mt-4 text-sm font-semibold tracking-[0.03em] text-brand">
                  {content.highlight.author}
                </p>
              </aside>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
