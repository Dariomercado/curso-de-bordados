import { Container } from "@/components/layout/Container";
import { FeatureCard } from "@/components/ui/FeatureCard";
import type { FeatureItem } from "@/types/feature";

type ValuePropositionSectionProps = {
  items: FeatureItem[];
};

export function ValuePropositionSection({
  items,
}: ValuePropositionSectionProps) {
  return (
    <section className="py-16 sm:py-20 lg:py-24" aria-label="Propuesta de valor">
      <Container>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </Container>
    </section>
  );
}
