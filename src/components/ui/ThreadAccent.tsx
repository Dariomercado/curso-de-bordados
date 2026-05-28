import type { SVGProps } from "react";

type ThreadAccentProps = SVGProps<SVGSVGElement> & {
  tone?: "brand" | "sage";
};

const strokeByTone = {
  brand: "rgba(142, 92, 85, 0.5)",
  sage: "rgba(131, 149, 126, 0.5)",
};

export function ThreadAccent({
  className,
  tone = "brand",
  ...props
}: ThreadAccentProps) {
  return (
    <svg
      viewBox="0 0 160 44"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M6 24C28 6 48 6 61 18C74 30 89 38 114 28C129 22 140 10 154 12"
        stroke={strokeByTone[tone]}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M110 28C114 28 118 31 118 36C118 39 116 41 112.5 41C109.5 41 107 39.3 107 36.3"
        stroke={strokeByTone[tone]}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="7" cy="24" r="3.25" fill={strokeByTone[tone]} />
    </svg>
  );
}
