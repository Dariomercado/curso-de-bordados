import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { footerContent } from "@/data/footer";
import { navigationItems, primaryNavigationCta } from "@/data/navigation";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteHeader items={navigationItems} cta={primaryNavigationCta} />
      <main className="pb-12 pt-8 sm:pb-16 sm:pt-10">{children}</main>
      <SiteFooter {...footerContent} />
    </>
  );
}
