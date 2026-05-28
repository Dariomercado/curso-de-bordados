import Image from "next/image";
import type { Testimonial } from "@/types/testimonial";

type TestimonialCardProps = {
  testimonial: Testimonial;
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="rounded-[2rem] border border-border/70 bg-surface-strong p-8 text-left shadow-soft sm:p-10">
      <div className="text-5xl leading-none text-[rgba(232,171,184,0.9)]">
        &ldquo;
      </div>
      <blockquote className="-mt-2 font-heading text-3xl italic leading-[1.5] text-foreground sm:text-[2.15rem]">
        {testimonial.quote}
      </blockquote>
      <footer className="mt-8 flex items-center gap-4">
        <Image
          src={testimonial.avatar.src}
          alt={testimonial.avatar.alt}
          width={56}
          height={56}
          className="h-14 w-14 rounded-full object-cover"
        />
        <div>
          <p className="text-lg font-semibold text-foreground">
            {testimonial.author}
          </p>
          <p className="text-sm text-foreground-muted">{testimonial.role}</p>
        </div>
      </footer>
    </article>
  );
}
