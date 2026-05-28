import type { Metadata } from "next";
import { UserRole } from "@prisma/client";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ThreadAccent } from "@/components/ui/ThreadAccent";
import { footerContent } from "@/data/footer";
import { navigationItems, primaryNavigationCta } from "@/data/navigation";
import { AdminEnrollmentManager } from "@/features/admin/components/AdminEnrollmentManager";
import { requireRole } from "@/lib/auth/guards";
import { getAdminUsersWithEnrollments } from "@/server/use-cases/get-admin-users-with-enrollments";

export const metadata: Metadata = {
  title: "Admin Usuarios",
  description: "Usuarios disponibles en el MVP de Atelier de Bordado.",
};

export default async function AdminUsersPage() {
  await requireRole(UserRole.ADMIN);

  const result = await getAdminUsersWithEnrollments();
  const users = result.success
    ? result.data.users.filter((user) => user.role === UserRole.STUDENT)
    : [];

  return (
    <>
      <SiteHeader items={navigationItems} cta={primaryNavigationCta} />

      <main className="pb-12 pt-8 sm:pb-16 sm:pt-10">
        <section className="py-16 sm:py-20" aria-labelledby="admin-users-heading">
          <Container>
            <SectionHeading
              id="admin-users-heading"
              eyebrow="Administracion"
              title="Usuarios"
              description="Vista inicial de usuarios, roles y accesos asignados."
            />
            <ThreadAccent className="mt-8 h-7 w-32" />

            {result.success ? (
              <div className="mt-10 grid gap-6">
                {users.map((user) => (
                  <article
                    key={user.id}
                    className="rounded-[2rem] border border-border/70 bg-surface px-6 py-8 shadow-soft sm:px-8"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <h2 className="font-heading text-3xl leading-tight text-foreground">
                          {user.name ?? "Usuario sin nombre"}
                        </h2>
                        <p className="mt-2 text-base text-foreground">{user.email}</p>
                      </div>

                      <dl className="grid gap-4 text-sm text-foreground-muted sm:grid-cols-3">
                        <div>
                          <dt className="uppercase tracking-[0.18em]">Rol</dt>
                          <dd className="mt-1 text-base text-foreground">{user.role}</dd>
                        </div>
                        <div>
                          <dt className="uppercase tracking-[0.18em]">Activo</dt>
                          <dd className="mt-1 text-base text-foreground">
                            {user.isActive ? "Si" : "No"}
                          </dd>
                        </div>
                        <div>
                          <dt className="uppercase tracking-[0.18em]">Cursos</dt>
                          <dd className="mt-1 text-base text-foreground">
                            {user.enrollmentsCount}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="mt-8 border-t border-border/70 pt-6">
                      <AdminEnrollmentManager
                        userId={user.id}
                        currentEnrollments={user.enrollments}
                        availableCourses={user.availableCourses}
                      />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-[2rem] border border-border/70 bg-surface px-6 py-8 shadow-soft sm:px-8">
                <p className="text-base leading-8 text-foreground-muted">
                  {result.message}
                </p>
              </div>
            )}
          </Container>
        </section>
      </main>

      <SiteFooter {...footerContent} />
    </>
  );
}
