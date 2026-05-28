import { Container } from "@/components/layout/Container";
import { KitCard } from "@/components/ui/KitCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Kit } from "@/types/kit";

type FeaturedKitsSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  kits: Kit[];
};

export function FeaturedKitsSection({
  eyebrow,
  title,
  description,
  kits,
}: FeaturedKitsSectionProps) {
  return (
    <section
      className="py-16 sm:py-20 lg:py-24"
      aria-labelledby="featured-kits-heading"
    >
      <Container>
        <SectionHeading
          id="featured-kits-heading"
          eyebrow={eyebrow}
          title={title}
          description={description}
          align="center"
        />

        <div className="mt-12 grid gap-8 xl:grid-cols-3">
          {kits.map((kit) => (
            <KitCard key={kit.href} kit={kit} />
          ))}
        </div>
      </Container>
    </section>
  );
}
