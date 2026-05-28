import { Container } from "@/components/layout/Container";
import { SkeletonBlock } from "@/components/ui/skeletons/SkeletonBlock";
import { ThreadAccent } from "@/components/ui/ThreadAccent";

export function CourseDetailSkeleton() {
  return (
    <section aria-busy="true" aria-labelledby="course-detail-loading-heading" className="py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <article className="rounded-[2rem] border border-border/70 bg-surface-strong p-6 shadow-soft sm:p-8 lg:p-10">
            <SkeletonBlock className="aspect-[16/9] w-full rounded-[1.75rem]" />
            <SkeletonBlock className="mt-8 h-4 w-20 rounded-full" />
            <SkeletonBlock className="mt-4 h-14 w-4/5 max-w-2xl" />
            <ThreadAccent className="mt-6 h-7 w-32 opacity-40" />
            <SkeletonBlock className="mt-6 h-5 w-full max-w-3xl" />
            <SkeletonBlock className="mt-3 h-5 w-11/12 max-w-2xl" />
            <SkeletonBlock className="mt-3 h-5 w-4/5 max-w-xl" />

            <div className="mt-10">
              <SkeletonBlock className="h-10 w-56" />
              <div className="mt-5 space-y-4">
                <div className="flex gap-3">
                  <SkeletonBlock className="mt-2 h-3 w-3 rounded-full" />
                  <SkeletonBlock className="h-5 w-5/6" />
                </div>
                <div className="flex gap-3">
                  <SkeletonBlock className="mt-2 h-3 w-3 rounded-full" />
                  <SkeletonBlock className="h-5 w-4/5" />
                </div>
                <div className="flex gap-3">
                  <SkeletonBlock className="mt-2 h-3 w-3 rounded-full" />
                  <SkeletonBlock className="h-5 w-3/4" />
                </div>
              </div>
            </div>
          </article>

          <aside className="rounded-[2rem] border border-border/70 bg-surface px-6 py-8 shadow-soft sm:px-8">
            <div className="sr-only" id="course-detail-loading-heading">
              Cargando detalle del curso
            </div>

            <SkeletonBlock className="h-4 w-20 rounded-full" />
            <div className="mt-6 space-y-6">
              <div className="border-b border-border/70 pb-5">
                <SkeletonBlock className="h-4 w-16" />
                <SkeletonBlock className="mt-3 h-9 w-28" />
              </div>
              <div className="border-b border-border/70 pb-5">
                <SkeletonBlock className="h-4 w-20" />
                <SkeletonBlock className="mt-3 h-7 w-32" />
              </div>
              <div className="pb-1">
                <SkeletonBlock className="h-4 w-16" />
                <SkeletonBlock className="mt-3 h-12 w-28" />
              </div>
            </div>

            <SkeletonBlock className="mt-8 h-12 w-full rounded-full" />
          </aside>
        </div>
      </Container>
    </section>
  );
}
