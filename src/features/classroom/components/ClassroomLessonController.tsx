"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ClassroomLayout } from "@/features/classroom/components/ClassroomLayout";
import { LessonContent } from "@/features/classroom/components/LessonContent";
import { LessonSidebar } from "@/features/classroom/components/LessonSidebar";

type Lesson = {
  id: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  position: number;
  isPreview: boolean;
};

type ClassroomLessonControllerProps = {
  course: {
    slug: string;
    title: string;
    subtitle: string | null;
    lessons: Lesson[];
  };
  initialLessonId?: string;
};

function buildLessonHref(courseSlug: string, lessonId: string) {
  return `/mis-cursos/${courseSlug}?lesson=${lessonId}`;
}

export function ClassroomLessonController({
  course,
  initialLessonId,
}: ClassroomLessonControllerProps) {
  const fallbackLessonId = course.lessons[0]?.id;
  const resolvedInitialLessonId =
    initialLessonId && course.lessons.some((lesson) => lesson.id === initialLessonId)
      ? initialLessonId
      : fallbackLessonId;

  const [activeLessonId, setActiveLessonId] = useState<string | undefined>(resolvedInitialLessonId);

  useEffect(() => {
    setActiveLessonId(resolvedInitialLessonId);
  }, [resolvedInitialLessonId]);

  const activeLessonIndex = useMemo(
    () => course.lessons.findIndex((lesson) => lesson.id === activeLessonId),
    [activeLessonId, course.lessons],
  );

  const activeLesson =
    activeLessonIndex >= 0 ? course.lessons[activeLessonIndex] : course.lessons[0] ?? null;
  const totalLessons = course.lessons.length;
  const previousLesson =
    activeLessonIndex > 0 ? course.lessons[activeLessonIndex - 1] : null;
  const nextLesson =
    activeLessonIndex >= 0 && activeLessonIndex < totalLessons - 1
      ? course.lessons[activeLessonIndex + 1]
      : null;

  useEffect(() => {
    if (!activeLessonId) {
      return;
    }

    const nextHref = buildLessonHref(course.slug, activeLessonId);
    const currentPathWithSearch = `${window.location.pathname}${window.location.search}`;

    if (currentPathWithSearch !== nextHref) {
      window.history.replaceState(window.history.state, "", nextHref);
    }
  }, [activeLessonId, course.slug]);

  const handleLessonSelect = useCallback(
    (lessonId: string) => {
      if (lessonId === activeLessonId) {
        return;
      }

      const lessonExists = course.lessons.some((lesson) => lesson.id === lessonId);

      if (!lessonExists) {
        return;
      }

      setActiveLessonId(lessonId);
    },
    [activeLessonId, course.lessons],
  );

  return (
    <ClassroomLayout
      title={course.title}
      description={
        course.subtitle ??
        "Accede a tus lecciones, repasa el contenido del curso y continua a tu ritmo."
      }
      sidebar={
        <LessonSidebar
          courseSlug={course.slug}
          activeLessonId={activeLesson?.id ?? null}
          activeLessonIndex={activeLessonIndex >= 0 ? activeLessonIndex + 1 : 0}
          lessons={course.lessons}
          previousLesson={previousLesson}
          nextLesson={nextLesson}
          onLessonSelect={handleLessonSelect}
        />
      }
      content={
        <LessonContent
          courseSlug={course.slug}
          courseTitle={course.title}
          lessonIndex={activeLessonIndex >= 0 ? activeLessonIndex + 1 : 0}
          totalLessons={totalLessons}
          lesson={activeLesson}
          previousLesson={previousLesson}
          nextLesson={nextLesson}
          onLessonSelect={handleLessonSelect}
        />
      }
    />
  );
}
