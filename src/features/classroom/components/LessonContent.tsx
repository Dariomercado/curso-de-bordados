import { LessonVideoPanel } from "@/features/classroom/components/LessonVideoPanel";
import { LessonNavigation } from "@/features/classroom/components/LessonNavigation";

type LessonContentProps = {
  courseSlug: string;
  courseTitle: string;
  lessonIndex: number;
  totalLessons: number;
  lesson: {
    id: string;
    title: string;
    content: string | null;
    videoUrl: string | null;
    position: number;
  } | null;
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

export function LessonContent({
  courseSlug,
  courseTitle,
  lessonIndex,
  totalLessons,
  lesson,
  previousLesson,
  nextLesson,
  onLessonSelect,
}: LessonContentProps) {
  if (!lesson) {
    return (
      <article className="rounded-[2rem] border border-border/70 bg-surface-strong p-6 shadow-soft sm:p-8 lg:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">
          Aula virtual
        </p>
        <h2 className="mt-4 font-heading text-4xl leading-tight text-foreground sm:text-5xl">
          Contenido pendiente
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-8 text-foreground-muted sm:text-lg">
          Este curso todavia no tiene lecciones disponibles para mostrar.
        </p>
      </article>
    );
  }

  return (
    <article className="rounded-[2rem] border border-border/70 bg-surface-strong p-6 shadow-soft sm:p-8 lg:p-10">
      <div className="border-b border-border/70 pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">
          Clase {lessonIndex} de {totalLessons}
        </p>
        <p className="mt-3 text-sm leading-7 text-foreground-muted">
          Curso: {courseTitle}
        </p>
      </div>

      <h2 className="mt-4 font-heading text-4xl leading-tight text-foreground sm:text-5xl">
        {lesson.title}
      </h2>
      <p className="mt-4 max-w-3xl text-base leading-8 text-foreground-muted sm:text-lg">
        Avanza con calma por esta clase. Puedes revisar el material audiovisual si ya
        esta disponible o apoyarte en el contenido escrito para seguir el hilo del curso.
      </p>

      <div className="mt-8">
        <LessonVideoPanel title={lesson.title} videoUrl={lesson.videoUrl} />
      </div>

      <div className="mt-8 rounded-[1.5rem] border border-border/70 bg-surface px-5 py-6 sm:px-6">
        <h3 className="font-heading text-2xl leading-tight text-foreground">
          Contenido de la clase
        </h3>
        <p className="mt-4 text-base leading-8 text-foreground-muted sm:text-lg">
          {lesson.content ?? "Esta leccion todavia no tiene contenido escrito cargado."}
        </p>
      </div>

      <LessonNavigation
        courseSlug={courseSlug}
        previousLesson={previousLesson}
        nextLesson={nextLesson}
        onLessonSelect={onLessonSelect}
      />
    </article>
  );
}
