import { SkeletonBlock } from "@/components/ui/skeletons/SkeletonBlock";

export function CourseCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-border/70 bg-surface-strong shadow-soft">
      <div className="relative overflow-hidden">
        <SkeletonBlock className="aspect-[4/3.1] w-full rounded-none" />
        <SkeletonBlock className="absolute right-4 top-4 h-8 w-28 rounded-full bg-white/75" />
      </div>

      <div className="p-8">
        <SkeletonBlock className="h-10 w-4/5" />
        <SkeletonBlock className="mt-4 h-5 w-full" />
        <SkeletonBlock className="mt-3 h-5 w-11/12" />
        <SkeletonBlock className="mt-3 h-5 w-3/4" />

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-border/70 pt-6">
          <SkeletonBlock className="h-10 w-24" />
          <SkeletonBlock className="h-11 w-32 rounded-full" />
        </div>
      </div>
    </article>
  );
}
