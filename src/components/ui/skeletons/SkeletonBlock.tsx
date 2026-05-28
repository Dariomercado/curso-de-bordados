type SkeletonBlockProps = {
  className?: string;
};

function joinClasses(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function SkeletonBlock({ className }: SkeletonBlockProps) {
  return (
    <div
      aria-hidden="true"
      className={joinClasses("rounded-[1rem] bg-[rgba(217,192,169,0.22)]", className)}
    />
  );
}
