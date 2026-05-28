import { Container } from "@/components/layout/Container";
import { SectionHeadingSkeleton } from "@/components/ui/skeletons/SectionHeadingSkeleton";
import { SkeletonBlock } from "@/components/ui/skeletons/SkeletonBlock";
import { ThreadAccent } from "@/components/ui/ThreadAccent";

export function AdminPageSkeleton() {
  return (
    <section aria-busy="true" aria-labelledby="admin-loading-heading" className="py-16 sm:py-20">
      <Container>
        <div className="sr-only" id="admin-loading-heading">
          Cargando panel admin
        </div>

        <SectionHeadingSkeleton />
        <ThreadAccent className="mt-8 h-7 w-32 opacity-40" />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <SkeletonBlock className="h-36 w-full rounded-[2rem]" />
          <SkeletonBlock className="h-36 w-full rounded-[2rem]" />
          <SkeletonBlock className="h-36 w-full rounded-[2rem]" />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <SkeletonBlock className="h-56 w-full rounded-[2rem]" />
          <SkeletonBlock className="h-56 w-full rounded-[2rem]" />
          <SkeletonBlock className="h-56 w-full rounded-[2rem]" />
        </div>
      </Container>
    </section>
  );
}
