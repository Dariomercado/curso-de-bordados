import Image from "next/image";
import { Container } from "@/components/layout/Container";
import type { AboutPreviewContent } from "@/types/about";

type AboutPreviewSectionProps = {
  content: AboutPreviewContent;
};

function renderHighlightedTitle(title: string, highlightedWord: string) {
  const [before, after] = title.split(highlightedWord);

  if (!after) {
    return title;
  }

  return (
    <>
      {before}
      <span className="italic text-brand">{highlightedWord}</span>
      {after}
    </>
  );
}

export function AboutPreviewSection({ content }: AboutPreviewSectionProps) {
  return (
    <section
      className="py-16 sm:py-20 lg:py-24"
      aria-labelledby="about-preview-heading"
    >
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.9fr)] lg:gap-14">
          <div className="order-2 lg:order-1">
            <h2
              id="about-preview-heading"
              className="max-w-3xl font-heading text-4xl leading-tight text-foreground sm:text-5xl"
            >
              {renderHighlightedTitle(content.title, content.highlightedWord)}
            </h2>

            <div className="mt-8 space-y-6 text-base leading-8 text-foreground-muted sm:text-lg">
              {content.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-4 text-brand">
              <span className="h-px w-12 bg-brand/60" />
              <p className="font-heading text-2xl italic">{content.signature}</p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto max-w-[520px]">
              <div className="absolute inset-0 -rotate-[5deg] rounded-[3rem] bg-[rgba(217,192,169,0.28)]" />
              <div className="relative overflow-hidden rounded-[3rem] border border-border/70 bg-surface-strong shadow-soft">
                <Image
                  src={content.image.src}
                  alt={content.image.alt}
                  width={900}
                  height={1120}
                  className="aspect-[4/5] h-auto w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
