"use client";

import type { MouseEvent } from "react";

type LessonNavigationProps = {
  courseSlug: string;
  previousLesson?: {
    id: string;
    title: string;
    position: number;
  } | null;
  nextLesson?: {
    id: string;
    title: string;
    position: number;
  } | null;
  onLessonSelect?: (lessonId: string) => void;
};

function buildLessonHref(courseSlug: string, lessonId: string) {
  return `/mis-cursos/${courseSlug}?lesson=${lessonId}`;
}

function shouldHandleClientNavigation(event: MouseEvent<HTMLAnchorElement>) {
  return !(
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

export function LessonNavigation({
  courseSlug,
  previousLesson,
  nextLesson,
  onLessonSelect,
}: LessonNavigationProps) {
  if (!previousLesson && !nextLesson) {
    return null;
  }

  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      <div className="flex">
        {previousLesson ? (
          <a
            href={buildLessonHref(courseSlug, previousLesson.id)}
            onClick={(event) => {
              if (!shouldHandleClientNavigation(event)) {
                return;
              }

              event.preventDefault();
              onLessonSelect?.(previousLesson.id);
            }}
            className="inline-flex min-h-14 w-full items-center justify-between rounded-[1.5rem] border border-border bg-surface-strong px-5 py-4 text-left font-body text-sm font-semibold tracking-[0.02em] text-foreground shadow-soft transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <span className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.16em] text-foreground-muted">
                Clase anterior
              </span>
              <span className="mt-1 text-sm font-semibold text-foreground">
                Clase {previousLesson.position}: {previousLesson.title}
              </span>
            </span>
          </a>
        ) : null}
      </div>

      <div className="flex">
        {nextLesson ? (
          <a
            href={buildLessonHref(courseSlug, nextLesson.id)}
            onClick={(event) => {
              if (!shouldHandleClientNavigation(event)) {
                return;
              }

              event.preventDefault();
              onLessonSelect?.(nextLesson.id);
            }}
            className="inline-flex min-h-14 w-full items-center justify-between rounded-[1.5rem] bg-brand px-5 py-4 text-left font-body text-sm font-semibold tracking-[0.02em] text-white shadow-soft transition-colors hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <span className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.16em] text-white/80">
                Siguiente clase
              </span>
              <span className="mt-1 text-sm font-semibold text-white">
                Clase {nextLesson.position}: {nextLesson.title}
              </span>
            </span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
