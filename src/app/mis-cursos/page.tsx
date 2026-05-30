import type { Metadata } from "next";
import Link from "next/link";
import { CourseStatus } from "@prisma/client";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ThreadAccent } from "@/components/ui/ThreadAccent";
import { requireAuthSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = {
  title: "Mis cursos",
  description: "Cursos asignados a tu cuenta en Atelier de Bordado.",
};

export default async function MyCoursesPage() {
  const session = await requireAuthSession();

  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId: session.user.id,
      course: {
        status: CourseStatus.PUBLISHED,
      },
    },
    include: {
      course: true,
    },
    orderBy: {
      accessGrantedAt: "desc",
    },
  });

  return (
    <section className="py-16 sm:py-20" aria-labelledby="my-courses-heading">
      <Container>
        <SectionHeading
          id="my-courses-heading"
          eyebrow="Area privada"
          title="Mis cursos"
          description="Cursos actualmente habilitados para tu cuenta."
        />
        <ThreadAccent className="mt-8 h-7 w-32" />

        {enrollments.length > 0 ? (
          <div className="mt-10 grid gap-6">
            {enrollments.map(({ course, accessGrantedAt }) => (
              <article
                key={course.id}
                className="rounded-[2rem] border border-border/70 bg-surface px-6 py-8 shadow-soft sm:px-8"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                  Acceso habilitado
                </p>
                <h2 className="mt-3 font-heading text-3xl leading-tight text-foreground">
                  {course.title}
                </h2>
                <p className="mt-4 text-base leading-8 text-foreground-muted">
                  {course.shortDescription ?? course.description}
                </p>
                <p className="mt-4 text-sm text-foreground-muted">
                  Desde {new Intl.DateTimeFormat("es-AR").format(accessGrantedAt)}
                </p>
                <div className="mt-6">
                  <Link
                    href={`/mis-cursos/${course.slug}`}
                    className="text-base font-semibold text-brand hover:text-brand-strong"
                  >
                    Ir al detalle del curso
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-border/70 bg-surface px-6 py-8 shadow-soft sm:px-8">
            <p className="text-base leading-8 text-foreground-muted">
              Todavia no vemos cursos habilitados en esta cuenta.
            </p>
            <p className="mt-3 text-base leading-8 text-foreground-muted">
              Si acabas de comprar, la confirmacion de Mercado Pago puede tardar unos
              minutos. Asegurate de ingresar con el mismo email que usaste durante la
              compra.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href="/recuperar-contrasena">
                Activar acceso / restablecer contrasena
              </Button>
              <Button href="/cursos" variant="secondary">
                Ver cursos
              </Button>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
