import type { Metadata } from "next";
import { AboutPreviewSection } from "@/components/sections/AboutPreviewSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { FeaturedCoursesSection } from "@/components/sections/FeaturedCoursesSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ValuePropositionSection } from "@/components/sections/ValuePropositionSection";
import { aboutPreviewContent } from "@/data/about";
import { benefitsSection } from "@/data/benefits";
import { finalCtaSection } from "@/data/cta";
import { featuredCoursesSection } from "@/data/courses";
import { featuresSection } from "@/data/features";
import { heroContent } from "@/data/hero";
import { testimonialsSection } from "@/data/testimonials";
import { getFeaturedPublishedCourses } from "@/server/use-cases/get-featured-published-courses";

export const metadata: Metadata = {
  title: "Cursos online de bordado artesanal",
  description:
    "Aprende bordado artesanal con cursos online paso a paso, una propuesta pensada para crear a tu ritmo.",
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const featuredCourses = await getFeaturedPublishedCourses();

  return (
    <>
      <HeroSection content={heroContent} />
      <ValuePropositionSection items={featuresSection.items} />
      <FeaturedCoursesSection
        eyebrow={featuredCoursesSection.eyebrow}
        title={featuredCoursesSection.title}
        description={featuredCoursesSection.description}
        cta={featuredCoursesSection.cta}
        courses={featuredCourses}
      />
      <AboutPreviewSection content={aboutPreviewContent} />
      <BenefitsSection
        title={benefitsSection.title}
        description={benefitsSection.description}
        cards={benefitsSection.cards}
        highlight={benefitsSection.highlight}
      />
      <TestimonialsSection
        eyebrow={testimonialsSection.eyebrow}
        title={testimonialsSection.title}
        description={testimonialsSection.description}
        testimonials={testimonialsSection.testimonials}
      />
      <FinalCtaSection
        title={finalCtaSection.title}
        description={finalCtaSection.description}
        action={finalCtaSection.action}
      />
    </>
  );
}
