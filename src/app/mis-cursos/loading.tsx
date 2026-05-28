import { Container } from "@/components/layout/Container";
import { SectionHeadingSkeleton } from "@/components/ui/skeletons/SectionHeadingSkeleton";
import { SkeletonBlock } from "@/components/ui/skeletons/SkeletonBlock";
import { ThreadAccent } from "@/components/ui/ThreadAccent";

export default function MyCoursesLoading() {
  return (
    <section aria-busy="true" aria-labelledby="my-courses-loading-heading" className="py-16 sm:py-20">
      <Container>
        <div className="sr-only" id="my-courses-loading-heading">
          Cargando mis cursos
        </div>

        <SectionHeadingSkeleton />
        <ThreadAccent className="mt-8 h-7 w-32 opacity-40" />

        <div className="mt-10 grid gap-6">
          <SkeletonBlock className="h-48 w-full rounded-[2rem]" />
          <SkeletonBlock className="h-48 w-full rounded-[2rem]" />
          <SkeletonBlock className="h-48 w-full rounded-[2rem]" />
        </div>
      </Container>
    </section>
  );
}
