import "dotenv/config";
import { CourseStatus, Prisma, UserRole } from "@prisma/client";
import { prisma } from "../src/lib/db/prisma";
import { hashPassword } from "../src/lib/auth/password";

type SeedCourse = {
  slug: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  description: string;
  longDescription: string;
  price: Prisma.Decimal;
  level: string;
  duration: string;
  coverImage: string;
  isFeatured: boolean;
  lessons: Array<{
    title: string;
    content: string;
    position: number;
    isPreview?: boolean;
  }>;
};

const seedCourses: SeedCourse[] = [
  {
    slug: "bordado-para-principiantes",
    title: "Bordado para Principiantes",
    subtitle: "Una base clara para empezar sin frustracion.",
    shortDescription:
      "Aprende materiales, tension, ritmo y los puntos esenciales para bordar con seguridad desde cero.",
    description:
      "Un curso inicial para dar tus primeras puntadas con criterio, confianza y una practica amable.",
    longDescription:
      "Este recorrido esta pensado para quienes quieren empezar a bordar con orden y sin abrumarse. Trabajamos materiales, preparacion de tela, uso del bastidor y una seleccion de puntadas esenciales con ejercicios breves y un proyecto final simple.",
    price: new Prisma.Decimal(4500),
    level: "Principiante",
    duration: "4 semanas a tu ritmo",
    coverImage: "/course-beginner.svg",
    isFeatured: true,
    lessons: [
      {
        title: "Materiales, bastidores e hilos",
        content:
          "Que conviene comprar al inicio, como elegir tela e hilo y como preparar una mesa de trabajo simple.",
        position: 1,
        isPreview: true,
      },
      {
        title: "Tension, postura y primeras puntadas",
        content:
          "Como sostener el bastidor, regular la tension y evitar errores comunes que cansan la mano.",
        position: 2,
      },
      {
        title: "Los puntos esenciales",
        content:
          "Punto atras, tallo, margarita, nudo frances y otras bases para construir motivos simples.",
        position: 3,
      },
      {
        title: "Proyecto final guiado",
        content:
          "Aplicacion de lo aprendido en una pieza pequena pensada para terminar y conservar.",
        position: 4,
      },
    ],
  },
  {
    slug: "disenos-florales",
    title: "Disenos Florales",
    subtitle: "Volumen, textura y composicion botanica.",
    shortDescription:
      "Un curso para bordar flores con mas intencion visual, capas de color y relieve suave.",
    description:
      "Explora motivos botanicos con puntadas de relleno, composicion y combinaciones delicadas de color.",
    longDescription:
      "Trabajamos petalos, hojas y pequenos bouquets desde una mirada compositiva. El foco esta en construir piezas florales armonicas, con textura y movimiento, sin perder limpieza tecnica ni sensibilidad cromatica.",
    price: new Prisma.Decimal(5200),
    level: "Intermedio",
    duration: "6 semanas con acceso extendido",
    coverImage: "/course-florals.svg",
    isFeatured: true,
    lessons: [
      {
        title: "Lectura visual de referencias florales",
        content:
          "Como simplificar una referencia botanica y llevarla a un diseno bordable con buen ritmo.",
        position: 1,
        isPreview: true,
      },
      {
        title: "Petalos con relieve y direccion",
        content:
          "Puntadas de relleno y variaciones de direccion para construir flores con volumen creible.",
        position: 2,
      },
      {
        title: "Hojas, tallos y equilibrio de composicion",
        content:
          "Como ordenar elementos secundarios para que acompanen la pieza sin competir con la flor principal.",
        position: 3,
      },
      {
        title: "Bouquet final paso a paso",
        content:
          "Desarrollo completo de una composicion floral terminada con correcciones y ajustes frecuentes.",
        position: 4,
      },
    ],
  },
  {
    slug: "pintura-con-aguja",
    title: "Pintura con Aguja",
    subtitle: "Color, direccion y realismo con hilo.",
    shortDescription:
      "Profundiza en degradados, luces y sombras para bordados mas expresivos y detallados.",
    description:
      "Un curso avanzado para trabajar realismo, mezcla de hebras y transiciones suaves de color.",
    longDescription:
      "La propuesta esta orientada a quienes ya dominan lo basico y quieren pasar a un lenguaje mas pictorico. Se trabajan degradados, capas de color, direccion de puntada y lectura de luces para lograr mayor profundidad y naturalismo.",
    price: new Prisma.Decimal(6800),
    level: "Avanzado",
    duration: "8 semanas de profundizacion",
    coverImage: "/course-needle-painting.svg",
    isFeatured: false,
    lessons: [
      {
        title: "Direccion de puntada para realismo",
        content:
          "Como observar la forma y decidir la direccion de cada grupo de puntadas para acompanar el volumen.",
        position: 1,
        isPreview: true,
      },
      {
        title: "Mezcla de hebras y degradados",
        content:
          "Construccion de transiciones suaves sin cortes bruscos ni bandas de color evidentes.",
        position: 2,
      },
      {
        title: "Luces, sombras y profundidad",
        content:
          "Analisis de contraste y superposicion de capas para piezas con mayor presencia visual.",
        position: 3,
      },
      {
        title: "Proyecto editorial final",
        content:
          "Desarrollo completo de una ilustracion bordada con revision de detalles y acabado final.",
        position: 4,
      },
    ],
  },
];

const adminSeed = {
  email: process.env.SEED_ADMIN_EMAIL ?? "admin@atelierbordado.com",
  password: process.env.SEED_ADMIN_PASSWORD ?? "Admin123!",
  name: "Admin Atelier",
  role: UserRole.ADMIN,
};

const studentSeed = {
  email: process.env.SEED_STUDENT_EMAIL ?? "alumna@atelierbordado.com",
  password: process.env.SEED_STUDENT_PASSWORD ?? "Student123!",
  name: "Alumna Demo",
  role: UserRole.STUDENT,
};

async function main() {
  for (const course of seedCourses) {
    const { lessons, ...courseData } = course;

    await prisma.course.upsert({
      where: {
        slug: course.slug,
      },
      update: {
        ...courseData,
        status: CourseStatus.PUBLISHED,
        lessons: {
          deleteMany: {},
          create: lessons,
        },
      },
      create: {
        ...courseData,
        status: CourseStatus.PUBLISHED,
        lessons: {
          create: lessons,
        },
      },
    });
  }

  const [adminPasswordHash, studentPasswordHash] = await Promise.all([
    hashPassword(adminSeed.password),
    hashPassword(studentSeed.password),
  ]);

  await prisma.user.upsert({
    where: {
      email: adminSeed.email,
    },
    update: {
      name: adminSeed.name,
      role: adminSeed.role,
      isActive: true,
      emailVerifiedAt: new Date(),
      passwordHash: adminPasswordHash,
    },
    create: {
      name: adminSeed.name,
      email: adminSeed.email,
      role: adminSeed.role,
      isActive: true,
      emailVerifiedAt: new Date(),
      passwordHash: adminPasswordHash,
    },
  });

  const student = await prisma.user.upsert({
    where: {
      email: studentSeed.email,
    },
    update: {
      name: studentSeed.name,
      role: studentSeed.role,
      isActive: true,
      emailVerifiedAt: new Date(),
      passwordHash: studentPasswordHash,
    },
    create: {
      name: studentSeed.name,
      email: studentSeed.email,
      role: studentSeed.role,
      isActive: true,
      emailVerifiedAt: new Date(),
      passwordHash: studentPasswordHash,
    },
  });

  const starterCourse = await prisma.course.findUnique({
    where: {
      slug: "bordado-para-principiantes",
    },
  });

  if (starterCourse) {
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: student.id,
          courseId: starterCourse.id,
        },
      },
      update: {},
      create: {
        userId: student.id,
        courseId: starterCourse.id,
      },
    });
  }

  console.log(
    `Seed completado. Cursos cargados: ${seedCourses.length}. Usuarios base: 2.`,
  );
}

main()
  .catch((error) => {
    console.error("Error al ejecutar el seed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
