import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

type FinalCtaSectionProps = {
  title: string;
  description: string;
  action: {
    label: string;
    href: string;
  };
};

export function FinalCtaSection({
  title,
  description,
  action,
}: FinalCtaSectionProps) {
  return (
    <section className="py-16 sm:py-20 lg:py-24" aria-labelledby="final-cta-heading">
      <Container>
        <div className="relative overflow-hidden rounded-[3rem] bg-brand px-6 py-16 text-center text-white shadow-soft sm:px-10 lg:px-16 lg:py-20">
          <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/6 blur-3xl" />
          <div className="absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-[rgba(217,192,169,0.12)] blur-3xl" />

          <div className="relative">
            <h2
              id="final-cta-heading"
              className="font-heading text-5xl leading-tight sm:text-6xl"
            >
              {title}
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/86 sm:text-xl">
              {description}
            </p>
            <div className="mt-10">
              <Button
                href={action.href}
                variant="secondary"
                className="border-white/15 bg-surface-strong text-brand hover:bg-white"
              >
                {action.label}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
