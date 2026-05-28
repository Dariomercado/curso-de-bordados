import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ThreadAccent } from "@/components/ui/ThreadAccent";
import { footerContent } from "@/data/footer";
import { navigationItems, primaryNavigationCta } from "@/data/navigation";

type CheckoutReturnPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  note: string;
  primaryLink: {
    href: string;
    label: string;
    className?: string;
  };
  secondaryLink: {
    href: string;
    label: string;
    className?: string;
  };
};

export function CheckoutReturnPage({
  eyebrow,
  title,
  description,
  note,
  primaryLink,
  secondaryLink,
}: CheckoutReturnPageProps) {
  return (
    <>
      <SiteHeader items={navigationItems} cta={primaryNavigationCta} />

      <main className="pb-12 pt-8 sm:pb-16 sm:pt-10">
        <section className="py-16 sm:py-20" aria-labelledby="checkout-return-heading">
          <Container>
            <SectionHeading
              id="checkout-return-heading"
              eyebrow={eyebrow}
              title={title}
              description={description}
            />
            <ThreadAccent className="mt-8 h-7 w-32" />

            <div className="mt-10 rounded-[2rem] border border-border/70 bg-surface px-6 py-8 shadow-soft sm:px-8 sm:py-10">
              <p className="max-w-2xl text-base leading-8 text-foreground-muted sm:text-lg">
                {note}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href={primaryLink.href} className={primaryLink.className}>
                  {primaryLink.label}
                </Button>
                <Button
                  href={secondaryLink.href}
                  variant="secondary"
                  className={secondaryLink.className}
                >
                  {secondaryLink.label}
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter {...footerContent} />
    </>
  );
}
