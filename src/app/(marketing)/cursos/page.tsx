import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { CourseCard } from "@/components/ui/CourseCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ThreadAccent } from "@/components/ui/ThreadAccent";
import { coursesPageContent } from "@/data/courses";
import { getPublishedCourses } from "@/server/use-cases/get-published-courses";

export const metadata: Metadata = {
  title: "Cursos",
  description: "Listado completo de cursos online de bordado artesanal de Atelier de Bordado.",
  alternates: {
    canonical: "/cursos",
  },
};

export default async function CoursesPage() {
  const courses = await getPublishedCourses();

  return (
    <section aria-labelledby="courses-heading" className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          id="courses-heading"
          eyebrow={coursesPageContent.eyebrow}
          title={coursesPageContent.title}
          description={coursesPageContent.description}
        />
        <ThreadAccent className="mt-8 h-7 w-32" />

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </Container>
    </section>
  );
}
