import Image from "next/image";
import { Button } from "@/components/ui/Button";
import type { Course } from "@/types/course";

type CourseCardProps = {
  course: Course;
};

const badgeClasses = {
  Principiante: "text-brand bg-white/92",
  Intermedio: "text-[color:rgb(86,111,76)] bg-white/92",
  Avanzado: "text-[color:rgb(140,93,45)] bg-white/92",
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-border/70 bg-surface-strong shadow-soft">
      <div className="relative overflow-hidden">
        <Image
          src={course.image.src}
          alt={course.image.alt}
          width={720}
          height={560}
          className="aspect-[4/3.1] h-auto w-full object-cover"
        />
        <span
          className={`absolute right-4 top-4 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${badgeClasses[course.level]}`}
        >
          {course.level}
        </span>
      </div>

      <div className="p-8">
        <h3 className="font-heading text-[2rem] leading-tight text-foreground">
          {course.title}
        </h3>
        <p className="mt-4 text-base leading-7 text-foreground-muted">
          {course.description}
        </p>
        <div className="mt-8 flex items-center justify-between gap-4 border-t border-border/70 pt-6">
          <p className="font-heading text-4xl leading-none text-brand">
            {course.price}
          </p>
          <Button href={course.href} size="sm">
            Inscribirme
          </Button>
        </div>
      </div>
    </article>
  );
}
