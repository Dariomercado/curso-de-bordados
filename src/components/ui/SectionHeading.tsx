import type { ReactNode } from "react";

type SectionHeadingProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
};

function joinClasses(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div
      className={joinClasses(
        "flex gap-6",
        isCentered
          ? "mx-auto max-w-3xl flex-col items-center text-center"
          : "flex-col justify-between md:flex-row md:items-end",
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">
            {eyebrow}
          </p>
        ) : null}

        <h2
          id={id}
          className="mt-4 font-heading text-4xl leading-tight text-foreground sm:text-5xl"
        >
          {title}
        </h2>

        {description ? (
          <p className="mt-5 text-base leading-8 text-foreground-muted sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <div className={joinClasses(isCentered ? undefined : "md:shrink-0")}>
          {action}
        </div>
      ) : null}
    </div>
  );
}
