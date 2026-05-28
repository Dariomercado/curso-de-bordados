import type { FeatureItem } from "@/types/feature";

type FeatureCardProps = {
  feature: FeatureItem;
};

const iconClassName = "h-5 w-5 text-brand-strong";

function FeatureIcon({ icon }: Pick<FeatureItem, "icon">) {
  if (icon === "play") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClassName}>
        <rect x="4" y="5" width="16" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10 19H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "kit") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClassName}>
        <path d="M7 8.5H17C17.8284 8.5 18.5 9.17157 18.5 10V18C18.5 18.8284 17.8284 19.5 17 19.5H7C6.17157 19.5 5.5 18.8284 5.5 18V10C5.5 9.17157 6.17157 8.5 7 8.5Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 8V6.75C9 5.7835 9.7835 5 10.75 5H13.25C14.2165 5 15 5.7835 15 6.75V8" stroke="currentColor" strokeWidth="1.8" />
        <path d="M5.5 12H18.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClassName}>
      <path
        d="M12.0001 19.25L4.96882 12.2188C3.58118 10.8311 3.58118 8.58112 4.96882 7.19348C6.35646 5.80584 8.60646 5.80584 9.9941 7.19348L12.0001 9.19949L14.0061 7.19348C15.3938 5.80584 17.6438 5.80584 19.0314 7.19348C20.419 8.58112 20.419 10.8311 19.0314 12.2188L12.0001 19.25Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const iconBackgrounds = {
  play: "bg-[rgba(239,184,196,0.65)]",
  kit: "bg-[rgba(198,219,177,0.8)]",
  heart: "bg-[rgba(245,208,170,0.82)]",
};

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <article className="rounded-[2rem] border border-border/70 bg-surface-strong p-8 shadow-soft sm:p-10">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full ${iconBackgrounds[feature.icon]}`}
      >
        <FeatureIcon icon={feature.icon} />
      </div>
      <h3 className="mt-8 font-heading text-3xl leading-tight text-foreground">
        {feature.title}
      </h3>
      <p className="mt-5 text-base leading-8 text-foreground-muted">
        {feature.description}
      </p>
    </article>
  );
}
