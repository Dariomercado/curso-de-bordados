export function LessonVideoPlaceholder() {
  return (
    <div className="flex aspect-video w-full items-center justify-center rounded-[1.75rem] border border-dashed border-border/80 bg-[rgba(226,214,205,0.35)] p-8 text-center shadow-soft">
      <div className="max-w-md">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
          Aula virtual
        </p>
        <h3 className="mt-4 font-heading text-3xl leading-tight text-foreground sm:text-4xl">
          Video pendiente de carga
        </h3>
        <p className="mt-4 text-base leading-8 text-foreground-muted sm:text-lg">
          Esta clase ya esta disponible dentro del curso. El video se cargara pronto y,
          mientras tanto, puedes apoyarte en el contenido escrito para avanzar a tu ritmo.
        </p>
      </div>
    </div>
  );
}
