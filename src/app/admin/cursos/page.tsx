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
  title: "Admin Cursos",
  description: "Vista inicial de cursos para administracion.",
};

export default async function AdminCoursesPage() {
  await requireRole(UserRole.ADMIN);

  const courses = await prisma.course.findMany({
    include: {
      _count: {
        select: {
          enrollments: true,
          lessons: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <>
      <SiteHeader items={navigationItems} cta={primaryNavigationCta} />

      <main className="pb-12 pt-8 sm:pb-16 sm:pt-10">
        <section className="py-16 sm:py-20" aria-labelledby="admin-courses-heading">
          <Container>
            <SectionHeading
              id="admin-courses-heading"
              eyebrow="Administracion"
              title="Cursos"
              description="Vista general de cursos existentes y accesos asignados."
            />
            <ThreadAccent className="mt-8 h-7 w-32" />

            <div className="mt-10 grid gap-6">
              {courses.map((course) => (
                <article
                  key={course.id}
                  className="rounded-[2rem] border border-border/70 bg-surface px-6 py-8 shadow-soft sm:px-8"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-brand">
                        {course.status}
                      </p>
                      <h2 className="mt-2 font-heading text-3xl leading-tight text-foreground">
                        {course.title}
                      </h2>
                      <p className="mt-4 text-base leading-8 text-foreground-muted">
                        {course.shortDescription ?? course.description}
                      </p>
                    </div>

                    <dl className="grid gap-4 text-sm text-foreground-muted sm:grid-cols-2">
                      <div>
                        <dt className="uppercase tracking-[0.18em]">Lecciones</dt>
                        <dd className="mt-1 text-base text-foreground">
                          {course._count.lessons}
                        </dd>
                      </div>
                      <div>
                        <dt className="uppercase tracking-[0.18em]">Accesos</dt>
                        <dd className="mt-1 text-base text-foreground">
                          {course._count.enrollments}
                        </dd>
                      </div>
                    </dl>
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
