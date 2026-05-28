import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Container } from "@/components/layout/Container";
import { AboutPreviewSection } from "@/components/sections/AboutPreviewSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ThreadAccent } from "@/components/ui/ThreadAccent";
import { aboutPageContent, aboutPreviewContent } from "@/data/about";
import { footerContent } from "@/data/footer";
import { navigationItems, primaryNavigationCta } from "@/data/navigation";

export const metadata: Metadata = {
  title: "Sobre mí",
  description:
    "Conocé la historia detrás de Atelier de Bordado y la mirada que inspira sus cursos.",
  alternates: {
    canonical: "/sobre-mi",
  },
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader items={navigationItems} cta={primaryNavigationCta} />

      <main className="pb-12 pt-8 sm:pb-16 sm:pt-10">
        <section className="py-16 sm:py-20" aria-labelledby="about-page-heading">
          <Container>
            <SectionHeading
              id="about-page-heading"
              eyebrow={aboutPageContent.eyebrow}
              title={aboutPageContent.title}
              description={aboutPageContent.introduction}
            />
            <ThreadAccent className="mt-8 h-7 w-32" />
          </Container>
        </section>

        <AboutPreviewSection content={aboutPreviewContent} />

        <section className="pb-8 pt-4 sm:pb-12" aria-label="Historia de Atelier de Bordado">
          <Container>
            <div className="grid gap-8 lg:grid-cols-2">
              {aboutPageContent.sections.map((section) => (
                <article
                  key={section.title}
                  className="rounded-[2rem] border border-border/70 bg-surface-strong p-8 shadow-soft sm:p-10"
                >
                  <h2 className="font-heading text-4xl leading-tight text-foreground">
                    {section.title}
                  </h2>
                  <div className="mt-5 space-y-5 text-base leading-8 text-foreground-muted sm:text-lg">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter {...footerContent} />
    </>
  );
}
