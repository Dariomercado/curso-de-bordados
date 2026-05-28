import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import type { Testimonial } from "@/types/testimonial";

type TestimonialsSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  testimonials: Testimonial[];
};

export function TestimonialsSection({
  eyebrow,
  title,
  description,
  testimonials,
}: TestimonialsSectionProps) {
  return (
    <section
      className="py-16 sm:py-20 lg:py-24"
      aria-labelledby="testimonials-heading"
    >
      <Container>
        <SectionHeading
          id="testimonials-heading"
          eyebrow={eyebrow}
          title={title}
          description={description}
          align="center"
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={`${testimonial.author}-${testimonial.role}`}
              testimonial={testimonial}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
