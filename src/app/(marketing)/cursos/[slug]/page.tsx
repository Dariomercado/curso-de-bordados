import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { CourseCheckoutInline } from "@/components/ui/CourseCheckoutInline";
import { ThreadAccent } from "@/components/ui/ThreadAccent";
import { getAuthSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { findPublishedCourseSlugs } from "@/server/repositories/course-repository";
import { getPublishedCourseBySlug } from "@/server/use-cases/get-published-course-by-slug";

type CourseDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const courses = await findPublishedCourseSlugs();

  return courses.map((course) => ({
    slug: course.slug,
  }));
}

export async function generateMetadata({
  params,
}: CourseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getPublishedCourseBySlug(slug);

  if (!course) {
    return {
      title: "Curso no encontrado",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: course.title,
    description: course.description,
    alternates: {
      canonical: `/cursos/${course.slug}`,
    },
    openGraph: {
      title: course.title,
      description: course.description,
      url: `/cursos/${course.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: course.title,
      description: course.description,
    },
  };
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { slug } = await params;
  const [course, session] = await Promise.all([
    getPublishedCourseBySlug(slug),
    getAuthSession(),
  ]);

  if (!course) {
    notFound();
  }

  const hasEnrollment = session?.user?.id
    ? Boolean(
        await prisma.enrollment.findFirst({
          where: {
            userId: session.user.id,
            course: {
              slug,
            },
          },
          select: {
            id: true,
          },
        }),
      )
    : false;

  return (
    <section className="py-16 sm:py-20" aria-labelledby="course-title">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <article className="rounded-[2rem] border border-border/70 bg-surface-strong p-6 shadow-soft sm:p-8 lg:p-10">
            <div className="overflow-hidden rounded-[1.75rem] border border-border/60">
              <Image
                src={course.image.src}
                alt={course.image.alt}
                width={1080}
                height={720}
                priority
                className="aspect-[16/9] h-auto w-full object-cover"
              />
            </div>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.22em] text-brand">
              {course.level}
            </p>
            <h1
              id="course-title"
              className="mt-4 font-heading text-5xl leading-tight text-foreground"
            >
              {course.title}
            </h1>
            <ThreadAccent className="mt-6 h-7 w-32" />
            <p className="mt-6 max-w-3xl text-base leading-8 text-foreground-muted sm:text-lg">
              {course.description}
            </p>

            <div className="mt-10">
              <h2 className="font-heading text-3xl leading-tight text-foreground">
                Contenido del curso
              </h2>
              <ul className="mt-5 space-y-4 text-base leading-8 text-foreground-muted">
                {course.content.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-3 h-2 w-2 rounded-full bg-brand" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <aside className="rounded-[2rem] border border-border/70 bg-surface px-6 py-8 shadow-soft sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">
              Detalles
            </p>
            <dl className="mt-6 space-y-6">
              <div className="border-b border-border/70 pb-5">
                <dt className="text-sm uppercase tracking-[0.18em] text-foreground-muted">
                  Nivel
                </dt>
                <dd className="mt-2 font-heading text-3xl text-foreground">
                  {course.level}
                </dd>
              </div>
              <div className="border-b border-border/70 pb-5">
                <dt className="text-sm uppercase tracking-[0.18em] text-foreground-muted">
                  Duracion
                </dt>
                <dd className="mt-2 text-lg text-foreground">{course.duration}</dd>
              </div>
              <div className="pb-1">
                <dt className="text-sm uppercase tracking-[0.18em] text-foreground-muted">
                  Precio
                </dt>
                <dd className="mt-2 font-heading text-5xl leading-none text-brand">
                  {course.price}
                </dd>
              </div>
            </dl>

            <div className="mt-8">
              {hasEnrollment ? (
                <Button href="/mis-cursos" className="w-full">
                  Continuar curso
                </Button>
              ) : (
                <CourseCheckoutInline
                  courseSlug={course.slug}
                  courseTitle={course.title}
                  initialEmail={session?.user?.email ?? ""}
                />
              )}
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
