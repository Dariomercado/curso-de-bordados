import { Prisma } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { mapCourseToCardViewModel } from "@/features/courses/mappers/course-view-model";

describe("mapCourseToCardViewModel", () => {
  it("maps a course with short description, lessons and known image alt", () => {
    const result = mapCourseToCardViewModel({
      slug: "bordado-para-principiantes",
      title: "Bordado para Principiantes",
      shortDescription: "Una base clara para empezar.",
      description: "Descripcion larga",
      price: new Prisma.Decimal(4500),
      level: "Principiante",
      duration: "4 semanas",
      coverImage: "/course-beginner.svg",
      lessons: [
        { title: "Introduccion", content: "Primeros pasos" },
        { title: "Materiales", content: null },
      ],
    });

    expect(result).toEqual({
      slug: "bordado-para-principiantes",
      title: "Bordado para Principiantes",
      description: "Una base clara para empezar.",
      level: "Principiante",
      duration: "4 semanas",
      price: "$ 4.500",
      content: ["Primeros pasos", "Materiales"],
      href: "/cursos/bordado-para-principiantes",
      image: {
        src: "/course-beginner.svg",
        alt: "Rueda de hilos de bordado de muchos colores organizada sobre una tela calida.",
      },
    });
  });

  it("falls back to defaults when optional values are missing", () => {
    const result = mapCourseToCardViewModel({
      slug: "curso-nuevo",
      title: "Curso Nuevo",
      shortDescription: null,
      description: "Descripcion principal",
      price: null,
      level: null,
      duration: null,
      coverImage: null,
    });

    expect(result).toEqual({
      slug: "curso-nuevo",
      title: "Curso Nuevo",
      description: "Descripcion principal",
      level: "Principiante",
      duration: "A definir",
      price: "Consultar",
      content: [],
      href: "/cursos/curso-nuevo",
      image: {
        src: "/course-beginner.svg",
        alt: "Portada del curso Curso Nuevo",
      },
    });
  });
});
