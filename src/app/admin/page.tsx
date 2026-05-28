import type { Metadata } from "next";
import Link from "next/link";
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
  title: "Admin",
  description: "Area administrativa inicial de Atelier de Bordado.",
};

const adminLinks = [
  {
    href: "/admin/leads",
    title: "Leads",
    description: "Consultas recibidas desde el formulario de contacto.",
  },
  {
    href: "/admin/usuarios",
    title: "Usuarios",
    description: "Usuarios activos, roles y cuentas creadas.",
  },
  {
    href: "/admin/cursos",
    title: "Cursos",
    description: "Vista general de cursos y accesos asignados.",
  },
];

export default async function AdminPage() {
  await requireRole(UserRole.ADMIN);

  const [leadsCount, usersCount, coursesCount] = await Promise.all([
    prisma.contactLead.count(),
    prisma.user.count(),
    prisma.course.count(),
  ]);

  const metrics = [
    { label: "Leads", value: leadsCount },
    { label: "Usuarios", value: usersCount },
    { label: "Cursos", value: coursesCount },
  ];

  return (
    <>
      <SiteHeader items={navigationItems} cta={primaryNavigationCta} />

      <main className="pb-12 pt-8 sm:pb-16 sm:pt-10">
        <section className="py-16 sm:py-20" aria-labelledby="admin-heading">
          <Container>
            <SectionHeading
              id="admin-heading"
              eyebrow="Administracion"
              title="Panel admin"
              description="Vista inicial para gestion interna del MVP."
            />
            <ThreadAccent className="mt-8 h-7 w-32" />

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {metrics.map((metric) => (
                <article
                  key={metric.label}
                  className="rounded-[2rem] border border-border/70 bg-surface px-6 py-8 shadow-soft sm:px-8"
                >
                  <p className="text-sm uppercase tracking-[0.18em] text-foreground-muted">
                    {metric.label}
                  </p>
                  <p className="mt-3 font-heading text-5xl text-foreground">
                    {metric.value}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {adminLinks.map((item) => (
                <article
                  key={item.href}
                  className="rounded-[2rem] border border-border/70 bg-surface-strong p-6 shadow-soft sm:p-8"
                >
                  <h2 className="font-heading text-3xl leading-tight text-foreground">
                    {item.title}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-foreground-muted">
                    {item.description}
                  </p>
                  <div className="mt-6">
                    <Link
                      href={item.href}
                      className="text-base font-semibold text-brand hover:text-brand-strong"
                    >
                      Abrir seccion
                    </Link>
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
