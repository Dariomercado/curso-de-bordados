import type { Metadata } from "next";
import { UserRole } from "@prisma/client";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ThreadAccent } from "@/components/ui/ThreadAccent";
import { footerContent } from "@/data/footer";
import { navigationItems, primaryNavigationCta } from "@/data/navigation";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = {
  title: "Admin Leads",
  description: "Leads de contacto recibidos en Atelier de Bordado.",
};

export default async function AdminLeadsPage() {
  await requireRole(UserRole.ADMIN);

  const leads = await prisma.contactLead.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <SiteHeader items={navigationItems} cta={primaryNavigationCta} />

      <main className="pb-12 pt-8 sm:pb-16 sm:pt-10">
        <section className="py-16 sm:py-20" aria-labelledby="admin-leads-heading">
          <Container>
            <SectionHeading
              id="admin-leads-heading"
              eyebrow="Administracion"
              title="Leads"
              description="Consultas recibidas desde el formulario de contacto."
            />
            <ThreadAccent className="mt-8 h-7 w-32" />

            <div className="mt-10 grid gap-6">
              {leads.map((lead) => (
                <article
                  key={lead.id}
                  className="rounded-[2rem] border border-border/70 bg-surface px-6 py-8 shadow-soft sm:px-8"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="font-heading text-3xl leading-tight text-foreground">
                      {lead.name}
                    </h2>
                    <p className="text-sm text-foreground-muted">
                      {new Intl.DateTimeFormat("es-AR").format(lead.createdAt)}
                    </p>
                  </div>
                  <p className="mt-4 text-base text-foreground">{lead.email}</p>
                  {lead.phone ? (
                    <p className="mt-1 text-base text-foreground-muted">{lead.phone}</p>
                  ) : null}
                  <p className="mt-4 text-base leading-8 text-foreground-muted">
                    {lead.message}
                  </p>
                </article>
              ))}

              {leads.length === 0 ? (
                <div className="rounded-[2rem] border border-border/70 bg-surface px-6 py-8 shadow-soft sm:px-8">
                  <p className="text-base leading-8 text-foreground-muted">
                    Aun no hay leads cargados.
                  </p>
                </div>
              ) : null}
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter {...footerContent} />
    </>
  );
}
