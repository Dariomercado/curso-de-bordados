import { SkeletonBlock } from "@/components/ui/skeletons/SkeletonBlock";

type SectionHeadingSkeletonProps = {
  withAction?: boolean;
};

export function SectionHeadingSkeleton({
  withAction = false,
}: SectionHeadingSkeletonProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <SkeletonBlock className="h-4 w-32 rounded-full" />
        <SkeletonBlock className="mt-4 h-11 w-full max-w-xl" />
        <SkeletonBlock className="mt-3 h-11 w-4/5 max-w-lg" />
        <SkeletonBlock className="mt-5 h-5 w-full max-w-2xl" />
        <SkeletonBlock className="mt-3 h-5 w-5/6 max-w-xl" />
      </div>

      {withAction ? (
        <div className="md:shrink-0">
          <SkeletonBlock className="h-11 w-36 rounded-full" />
        </div>
      ) : null}
    </div>
  );
}
