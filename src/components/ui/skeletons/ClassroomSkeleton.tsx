import { Container } from "@/components/layout/Container";
import { SkeletonBlock } from "@/components/ui/skeletons/SkeletonBlock";
import { SectionHeadingSkeleton } from "@/components/ui/skeletons/SectionHeadingSkeleton";
import { ThreadAccent } from "@/components/ui/ThreadAccent";

export function ClassroomSkeleton() {
  return (
    <section aria-busy="true" aria-labelledby="classroom-loading-heading" className="py-16 sm:py-20">
      <Container>
        <div className="sr-only" id="classroom-loading-heading">
          Cargando aula virtual
        </div>

        <SectionHeadingSkeleton withAction />
        <ThreadAccent className="mt-8 h-7 w-32 opacity-40" />

        <div className="mt-10 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          <aside className="order-2 rounded-[2rem] border border-border/70 bg-surface px-6 py-8 shadow-soft sm:px-8 lg:order-1">
            <SkeletonBlock className="h-4 w-24 rounded-full" />
            <SkeletonBlock className="mt-3 h-4 w-32" />

            <div className="mt-6 rounded-[1.5rem] border border-border/70 bg-surface-strong px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <SkeletonBlock className="h-10 w-10 rounded-full" />
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-10 w-10 rounded-full" />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <SkeletonBlock className="h-24 w-full rounded-[1.5rem]" />
              <SkeletonBlock className="h-24 w-full rounded-[1.5rem]" />
              <SkeletonBlock className="h-24 w-full rounded-[1.5rem]" />
              <SkeletonBlock className="h-24 w-full rounded-[1.5rem]" />
            </div>
          </aside>

          <article className="order-1 rounded-[2rem] border border-border/70 bg-surface-strong p-6 shadow-soft sm:p-8 lg:order-2 lg:p-10">
            <div className="border-b border-border/70 pb-6">
              <SkeletonBlock className="h-4 w-32 rounded-full" />
              <SkeletonBlock className="mt-3 h-4 w-48" />
            </div>

            <SkeletonBlock className="mt-4 h-12 w-3/4 max-w-2xl" />
            <SkeletonBlock className="mt-4 h-5 w-full max-w-3xl" />
            <SkeletonBlock className="mt-3 h-5 w-11/12 max-w-2xl" />

            <SkeletonBlock className="mt-8 aspect-video w-full rounded-[1.75rem]" />

            <div className="mt-8 rounded-[1.5rem] border border-border/70 bg-surface px-5 py-6 sm:px-6">
              <SkeletonBlock className="h-8 w-44" />
              <SkeletonBlock className="mt-4 h-5 w-full" />
              <SkeletonBlock className="mt-3 h-5 w-11/12" />
              <SkeletonBlock className="mt-3 h-5 w-5/6" />
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <SkeletonBlock className="h-14 w-full rounded-[1.5rem]" />
              <SkeletonBlock className="h-14 w-full rounded-[1.5rem]" />
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}
