import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
} & ComponentPropsWithoutRef<"div">;

function joinClasses(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function Container({
  children,
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={joinClasses(
        "mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-10",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
