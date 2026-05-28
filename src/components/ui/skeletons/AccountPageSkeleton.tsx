import { Container } from "@/components/layout/Container";
import { SectionHeadingSkeleton } from "@/components/ui/skeletons/SectionHeadingSkeleton";
import { SkeletonBlock } from "@/components/ui/skeletons/SkeletonBlock";
import { ThreadAccent } from "@/components/ui/ThreadAccent";

export function AccountPageSkeleton() {
  return (
    <section aria-busy="true" aria-labelledby="account-loading-heading" className="py-16 sm:py-20">
      <Container>
        <div className="sr-only" id="account-loading-heading">
          Cargando mi cuenta
        </div>

        <SectionHeadingSkeleton />
        <ThreadAccent className="mt-8 h-7 w-32 opacity-40" />

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="rounded-[2rem] border border-border/70 bg-surface-strong p-6 shadow-soft sm:p-8">
            <div className="grid gap-6">
              <div>
                <SkeletonBlock className="h-4 w-20 rounded-full" />
                <SkeletonBlock className="mt-2 h-7 w-48" />
              </div>
              <div>
                <SkeletonBlock className="h-4 w-16 rounded-full" />
                <SkeletonBlock className="mt-2 h-7 w-56" />
              </div>
              <div>
                <SkeletonBlock className="h-4 w-12 rounded-full" />
                <SkeletonBlock className="mt-2 h-7 w-24" />
              </div>
            </div>
          </article>

          <aside className="rounded-[2rem] border border-border/70 bg-surface px-6 py-8 shadow-soft sm:px-8">
            <SkeletonBlock className="h-10 w-32" />
            <div className="mt-6 grid gap-4">
              <SkeletonBlock className="h-12 w-full rounded-full" />
              <SkeletonBlock className="h-12 w-full rounded-full" />
              <SkeletonBlock className="h-12 w-full rounded-full" />
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
