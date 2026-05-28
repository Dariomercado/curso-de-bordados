"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";

type EnrollmentItem = {
  id: string;
  accessGrantedAt: string;
  course: {
    id: string;
    title: string;
    slug: string;
  };
};

type AvailableCourse = {
  id: string;
  title: string;
  slug: string;
};

type AdminEnrollmentManagerProps = {
  userId: string;
  currentEnrollments: EnrollmentItem[];
  availableCourses: AvailableCourse[];
};

type ActionState = {
  type: "success" | "error";
  message: string;
} | null;

export function AdminEnrollmentManager({
  userId,
  currentEnrollments,
  availableCourses,
}: AdminEnrollmentManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedCourseId, setSelectedCourseId] = useState(availableCourses[0]?.id ?? "");
  const [actionState, setActionState] = useState<ActionState>(null);
  const [activeEnrollmentId, setActiveEnrollmentId] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<"assign" | "revoke" | null>(null);

  const hasAvailableCourses = availableCourses.length > 0;

  useEffect(() => {
    if (!hasAvailableCourses) {
      setSelectedCourseId("");
      return;
    }

    const currentSelectionIsAvailable = availableCourses.some(
      (course) => course.id === selectedCourseId,
    );

    if (!currentSelectionIsAvailable) {
      setSelectedCourseId(availableCourses[0].id);
    }
  }, [availableCourses, hasAvailableCourses, selectedCourseId]);

  function handleAssignCourse() {
    if (!selectedCourseId) {
      setActionState({
        type: "error",
        message: "Selecciona un curso para asignar.",
      });
      return;
    }

    setActiveEnrollmentId(null);
    setActiveAction("assign");

    startTransition(async () => {
      setActionState(null);

      try {
        const response = await fetch("/api/admin/enrollments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            courseId: selectedCourseId,
          }),
        });

        const payload = (await response.json()) as {
          success?: boolean;
          message?: string;
          errors?: Record<string, string>;
        };

        if (!response.ok || !payload.success) {
          setActionState({
            type: "error",
            message:
              payload.errors?.courseId ??
              payload.errors?.userId ??
              payload.message ??
              "No se pudo asignar el acceso.",
          });
          return;
        }

        setActionState({
          type: "success",
          message: payload.message ?? "Acceso asignado correctamente.",
        });
        router.refresh();
      } catch {
        setActionState({
          type: "error",
          message: "No se pudo asignar el acceso.",
        });
      } finally {
        setActiveAction(null);
      }
    });
  }

  function handleRevokeAccess(enrollmentId: string) {
    setActiveEnrollmentId(enrollmentId);
    setActiveAction("revoke");

    startTransition(async () => {
      setActionState(null);

      try {
        const response = await fetch(`/api/admin/enrollments/${enrollmentId}`, {
          method: "DELETE",
        });

        const payload = (await response.json()) as {
          success?: boolean;
          message?: string;
        };

        if (!response.ok || !payload.success) {
          setActionState({
            type: "error",
            message: payload.message ?? "No se pudo revocar el acceso.",
          });
          return;
        }

        setActionState({
          type: "success",
          message: payload.message ?? "Acceso revocado correctamente.",
        });
        router.refresh();
      } catch {
        setActionState({
          type: "error",
          message: "No se pudo revocar el acceso.",
        });
      } finally {
        setActiveEnrollmentId(null);
        setActiveAction(null);
      }
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div>
        <h3 className="font-heading text-2xl leading-tight text-foreground">
          Accesos actuales
        </h3>

        {currentEnrollments.length > 0 ? (
          <div className="mt-5 grid gap-4">
            {currentEnrollments.map((enrollment) => {
              const isRevoking =
                isPending &&
                activeAction === "revoke" &&
                activeEnrollmentId === enrollment.id;

              return (
                <article
                  key={enrollment.id}
                  className="rounded-[1.5rem] border border-border/70 bg-surface-strong px-5 py-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-foreground">
                        {enrollment.course.title}
                      </h4>
                      <p className="mt-2 text-sm leading-7 text-foreground-muted">
                        /cursos/{enrollment.course.slug}
                      </p>
                      <p className="mt-1 text-sm leading-7 text-foreground-muted">
                        Desde{" "}
                        {new Intl.DateTimeFormat("es-AR").format(
                          new Date(enrollment.accessGrantedAt),
                        )}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleRevokeAccess(enrollment.id)}
                    >
                      {isRevoking ? "Revocando..." : "Revocar"}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-5 rounded-[1.5rem] border border-border/70 bg-surface-strong px-5 py-5">
            <p className="text-sm leading-7 text-foreground-muted">
              Este usuario todavia no tiene cursos asignados.
            </p>
          </div>
        )}
      </div>

      <aside className="rounded-[1.5rem] border border-border/70 bg-surface-strong px-5 py-6">
        <h3 className="font-heading text-2xl leading-tight text-foreground">
          Asignar acceso
        </h3>
        <p className="mt-2 text-sm leading-7 text-foreground-muted">
          Selecciona un curso publicado disponible para este usuario.
        </p>

        <div className="mt-5">
          <label
            htmlFor={`course-select-${userId}`}
            className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground-muted"
          >
            Curso publicado
          </label>

          <select
            id={`course-select-${userId}`}
            value={selectedCourseId}
            onChange={(event) => setSelectedCourseId(event.target.value)}
            disabled={isPending || !hasAvailableCourses}
            className="mt-2 min-h-12 w-full rounded-[1.25rem] border border-border/70 bg-background px-4 text-base text-foreground outline-none transition focus:border-brand disabled:cursor-not-allowed disabled:opacity-60"
          >
            {hasAvailableCourses ? (
              availableCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))
            ) : (
              <option value="">No hay cursos disponibles</option>
            )}
          </select>
        </div>

        <div className="mt-5">
          <Button
            type="button"
            className="w-full"
            disabled={isPending || !hasAvailableCourses}
            onClick={handleAssignCourse}
          >
            {isPending && activeAction === "assign" ? "Asignando..." : "Asignar acceso"}
          </Button>
        </div>

        {actionState ? (
          <p
            className={`mt-4 text-sm leading-7 ${
              actionState.type === "success"
                ? "text-[color:rgb(63,111,74)]"
                : "text-[color:rgb(150,74,74)]"
            }`}
          >
            {actionState.message}
          </p>
        ) : null}
      </aside>
    </div>
  );
}
