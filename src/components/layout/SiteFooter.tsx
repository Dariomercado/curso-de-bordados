import Link from "next/link";
import { Container } from "@/components/layout/Container";

type FooterLink = {
  label: string;
  href: string;
};

type SiteFooterProps = {
  brand: string;
  description: string;
  primaryLinks: FooterLink[];
  contactLinks: FooterLink[];
  socialLinks: FooterLink[];
  copyright: string;
};

export function SiteFooter({
  brand,
  description,
  primaryLinks,
  contactLinks,
  socialLinks,
  copyright,
}: SiteFooterProps) {
  return (
    <footer className="pb-12 pt-16 sm:pb-14 sm:pt-20">
      <Container>
        <div className="border-t border-border/70 pt-8">
          <div className="grid gap-10 md:grid-cols-[1.15fr_1fr_0.9fr]">
            <div>
              <p className="font-heading text-3xl text-brand-strong">{brand}</p>
              <p className="mt-5 max-w-sm text-base leading-8 text-foreground-muted">
                {description}
              </p>
              <div className="mt-6 flex gap-4">
                {socialLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-foreground-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xl font-semibold text-brand-strong">Explorar</p>
              <div className="mt-5 grid grid-cols-2 gap-4">
                {primaryLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-base text-foreground-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xl font-semibold text-brand-strong">Contacto</p>
              <div className="mt-5 space-y-4">
                {contactLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-base text-foreground-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-border/70 pt-8 text-center text-sm text-foreground-muted">
            {copyright}
          </div>
        </div>
      </Container>
    </footer>
  );
}
