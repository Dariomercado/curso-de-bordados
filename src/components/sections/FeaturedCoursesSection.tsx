import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { CourseCard } from "@/components/ui/CourseCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ThreadAccent } from "@/components/ui/ThreadAccent";
import type { Course } from "@/types/course";

type FeaturedCoursesSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  cta: {
    label: string;
    href: string;
  };
  courses: Course[];
};

export function FeaturedCoursesSection({
  eyebrow,
  title,
  description,
  cta,
  courses,
}: FeaturedCoursesSectionProps) {
  return (
    <section
      className="py-16 sm:py-20 lg:py-24"
      aria-labelledby="featured-courses-heading"
    >
      <Container>
        <div className="rounded-[2rem] border border-border/70 bg-surface px-6 py-10 shadow-soft sm:px-8 lg:px-10 lg:py-12">
          <SectionHeading
            id="featured-courses-heading"
            eyebrow={eyebrow}
            title={title}
            description={description}
            action={
              <Link
                href={cta.href}
                className="inline-flex items-center gap-3 text-base font-semibold text-brand hover:text-brand-strong"
              >
                <span>{cta.label}</span>
                <span aria-hidden="true" className="text-xl">
                  {">"}
                </span>
              </Link>
            }
          />

          <ThreadAccent className="mt-8 h-7 w-32" />

          <div className="mt-10 grid gap-6 xl:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.href} course={course} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
