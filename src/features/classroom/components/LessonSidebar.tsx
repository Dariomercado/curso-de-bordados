"use client";

import type { MouseEvent } from "react";

type LessonSidebarProps = {
  courseSlug: string;
  activeLessonId: string | null;
  activeLessonIndex: number;
  lessons: Array<{
    id: string;
    title: string;
    position: number;
    isPreview: boolean;
  }>;
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

export function LessonSidebar({
  courseSlug,
  activeLessonId,
  activeLessonIndex,
  lessons,
  previousLesson,
  nextLesson,
  onLessonSelect,
}: LessonSidebarProps) {
  const totalLessons = lessons.length;

  return (
    <aside className="rounded-[2rem] border border-border/70 bg-surface px-6 py-8 shadow-soft sm:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">
            Lecciones
          </p>
          <p className="mt-2 text-sm leading-7 text-foreground-muted">
            {totalLessons} {totalLessons === 1 ? "clase disponible" : "clases disponibles"}
          </p>
        </div>
      </div>

      {totalLessons > 0 ? (
        <div className="mt-6 rounded-[1.5rem] border border-border/70 bg-surface-strong px-4 py-3">
          <div className="flex items-center justify-between gap-3">
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-surface text-lg text-foreground transition hover:border-brand/30 hover:bg-background"
                aria-label={`Ir a la clase anterior: ${previousLesson.title}`}
              >
                <span aria-hidden="true">&larr;</span>
              </a>
            ) : (
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-surface text-lg text-foreground-muted opacity-50"
                aria-hidden="true"
              >
                <span aria-hidden="true">&larr;</span>
              </span>
            )}

            <div className="min-w-0 flex-1 text-center">
              <p className="text-sm font-semibold text-foreground">
                Clase {activeLessonIndex} de {totalLessons}
              </p>
            </div>

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
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-surface text-lg text-foreground transition hover:border-brand/30 hover:bg-background"
                aria-label={`Ir a la siguiente clase: ${nextLesson.title}`}
              >
                <span aria-hidden="true">&rarr;</span>
              </a>
            ) : (
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-surface text-lg text-foreground-muted opacity-50"
                aria-hidden="true"
              >
                <span aria-hidden="true">&rarr;</span>
              </span>
            )}
          </div>
        </div>
      ) : null}

      {lessons.length > 0 ? (
        <nav className="mt-6 space-y-3" aria-label="Listado de lecciones del curso">
          {lessons.map((lesson) => {
            const isActive = lesson.id === activeLessonId;

            return (
              <a
                key={lesson.id}
                href={buildLessonHref(courseSlug, lesson.id)}
                onClick={(event) => {
                  if (!shouldHandleClientNavigation(event)) {
                    return;
                  }

                  event.preventDefault();
                  onLessonSelect?.(lesson.id);
                }}
                className={`block rounded-[1.5rem] border px-4 py-4 transition ${
                  isActive
                    ? "border-brand/50 bg-[rgba(217,192,169,0.28)] shadow-soft ring-1 ring-brand/20"
                    : "border-border/70 bg-surface-strong hover:border-brand/30 hover:bg-background"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className={`text-xs font-semibold uppercase tracking-[0.16em] ${
                        isActive ? "text-brand-strong" : "text-brand"
                      }`}
                    >
                      Clase {lesson.position} de {totalLessons}
                    </p>
                    <p className="mt-2 text-base font-semibold leading-7 text-foreground">
                      {lesson.title}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    {isActive ? (
                      <span className="rounded-full bg-brand px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                        Actual
                      </span>
                    ) : null}
                  </div>
                </div>
              </a>
            );
          })}
        </nav>
      ) : (
        <div className="mt-6 rounded-[1.5rem] border border-border/70 bg-surface-strong px-4 py-5">
          <p className="text-base leading-8 text-foreground-muted">
            Este curso todavia no tiene lecciones cargadas.
          </p>
        </div>
      )}
    </aside>
  );
}
