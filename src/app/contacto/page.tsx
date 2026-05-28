import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ThreadAccent } from "@/components/ui/ThreadAccent";
import { footerContent } from "@/data/footer";
import { navigationItems, primaryNavigationCta } from "@/data/navigation";
import { contactPageContent } from "@/data/contact";
import { ContactForm } from "@/features/contact/components/ContactForm";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escribí a Atelier de Bordado para consultar por cursos, niveles y próximos pasos.",
  alternates: {
    canonical: "/contacto",
  },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader items={navigationItems} cta={primaryNavigationCta} />

      <main className="pb-12 pt-8 sm:pb-16 sm:pt-10">
        <section className="py-16 sm:py-20" aria-labelledby="contact-page-heading">
          <Container>
            <SectionHeading
              id="contact-page-heading"
              eyebrow={contactPageContent.eyebrow}
              title={contactPageContent.title}
              description={contactPageContent.description}
            />
            <ThreadAccent className="mt-8 h-7 w-32" />

            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
              <div>
                <div className="mb-6 rounded-[2rem] border border-border/70 bg-surface px-6 py-8 shadow-soft sm:px-8">
                  <h2 className="font-heading text-3xl leading-tight text-foreground">
                    {contactPageContent.form.title}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-foreground-muted sm:text-lg">
                    {contactPageContent.form.description}
                  </p>
                </div>

                <ContactForm
                  submitLabel={contactPageContent.form.submitLabel}
                  successMessage={contactPageContent.form.successMessage}
                />
              </div>

              <aside className="rounded-[2rem] border border-border/70 bg-surface px-6 py-8 shadow-soft sm:px-8">
                <h2 className="font-heading text-3xl leading-tight text-foreground">
                  {contactPageContent.sidebar.title}
                </h2>
                <ul className="mt-6 space-y-4 text-base leading-8 text-foreground-muted">
                  {contactPageContent.sidebar.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-3 h-2 w-2 rounded-full bg-brand" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter {...footerContent} />
    </>
  );
}
