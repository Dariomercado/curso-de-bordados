import type { Prisma } from "@prisma/client";

const imageAltBySlug: Record<string, string> = {
  "bordado-para-principiantes":
    "Rueda de hilos de bordado de muchos colores organizada sobre una tela calida.",
  "disenos-florales":
    "Bordado floral delicado con flores claras y tallos finos sobre lino.",
  "pintura-con-aguja":
    "Ave bordada con plumas intensas y texturas detalladas en tonos turquesa y terracota.",
};

function formatPrice(price: Prisma.Decimal | null) {
  if (!price) {
    return "Consultar";
  }

  const value = Number(price);

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

type CourseWithLessons = {
  slug: string;
  title: string;
  shortDescription: string | null;
  description: string;
  price: Prisma.Decimal | null;
  level: string | null;
  duration: string | null;
  coverImage: string | null;
  lessons?: Array<{
    title: string;
    content: string | null;
  }>;
};

export function mapCourseToCardViewModel(course: CourseWithLessons) {
  return {
    slug: course.slug,
    title: course.title,
    description: course.shortDescription ?? course.description,
    level: (course.level ?? "Principiante") as
      | "Principiante"
      | "Intermedio"
      | "Avanzado",
    duration: course.duration ?? "A definir",
    price: formatPrice(course.price),
    content:
      course.lessons?.map((lesson) => lesson.content ?? lesson.title) ?? [],
    href: `/cursos/${course.slug}`,
    image: {
      src: course.coverImage ?? "/course-beginner.svg",
      alt: imageAltBySlug[course.slug] ?? `Portada del curso ${course.title}`,
    },
  };
}
