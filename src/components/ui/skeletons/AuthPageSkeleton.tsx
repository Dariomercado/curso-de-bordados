import { Container } from "@/components/layout/Container";
import { SectionHeadingSkeleton } from "@/components/ui/skeletons/SectionHeadingSkeleton";
import { SkeletonBlock } from "@/components/ui/skeletons/SkeletonBlock";
import { ThreadAccent } from "@/components/ui/ThreadAccent";

export function AuthPageSkeleton() {
  return (
    <section aria-busy="true" aria-labelledby="auth-loading-heading" className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="sr-only" id="auth-loading-heading">
            Cargando acceso
          </div>

          <SectionHeadingSkeleton />
          <ThreadAccent className="mt-8 h-7 w-32 opacity-40" />

          <div className="mt-10 rounded-[2rem] border border-border/70 bg-surface-strong p-6 shadow-soft sm:p-8">
            <div className="grid gap-5">
              <div>
                <SkeletonBlock className="h-4 w-20 rounded-full" />
                <SkeletonBlock className="mt-2 h-13 w-full rounded-full" />
              </div>
              <div>
                <SkeletonBlock className="h-4 w-28 rounded-full" />
                <SkeletonBlock className="mt-2 h-13 w-full rounded-full" />
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <SkeletonBlock className="h-4 w-36" />
              <SkeletonBlock className="h-4 w-40" />
            </div>

            <SkeletonBlock className="mt-8 h-12 w-32 rounded-full" />
          </div>
        </div>
      </Container>
    </section>
  );
}
