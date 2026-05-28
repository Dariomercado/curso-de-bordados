import { Container } from "@/components/layout/Container";
import { ThreadAccent } from "@/components/ui/ThreadAccent";
import { CourseCardSkeleton } from "@/components/ui/skeletons/CourseCardSkeleton";
import { SectionHeadingSkeleton } from "@/components/ui/skeletons/SectionHeadingSkeleton";

export function CourseGridSkeleton() {
  return (
    <section aria-busy="true" aria-labelledby="courses-loading-heading" className="py-16 sm:py-20">
      <Container>
        <div className="sr-only" id="courses-loading-heading">
          Cargando cursos
        </div>

        <SectionHeadingSkeleton />
        <ThreadAccent className="mt-8 h-7 w-32 opacity-40" />

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
        </div>
      </Container>
    </section>
  );
}
