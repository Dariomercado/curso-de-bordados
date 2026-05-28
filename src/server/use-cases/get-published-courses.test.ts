import { beforeEach, describe, expect, it, vi } from "vitest";

const { findPublishedCoursesMock, mapCourseToCardViewModelMock } = vi.hoisted(() => ({
  findPublishedCoursesMock: vi.fn(),
  mapCourseToCardViewModelMock: vi.fn(),
}));

vi.mock("@/server/repositories/course-repository", () => ({
  findPublishedCourses: findPublishedCoursesMock,
}));

vi.mock("@/features/courses/mappers/course-view-model", () => ({
  mapCourseToCardViewModel: mapCourseToCardViewModelMock,
}));

import { getPublishedCourses } from "@/server/use-cases/get-published-courses";

describe("getPublishedCourses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads published courses from the repository and maps each one", async () => {
    const repositoryCourses = [
      { slug: "curso-1", title: "Curso 1" },
      { slug: "curso-2", title: "Curso 2" },
    ];

    const mappedCourses = [
      { slug: "curso-1", href: "/cursos/curso-1" },
      { slug: "curso-2", href: "/cursos/curso-2" },
    ];

    findPublishedCoursesMock.mockResolvedValue(repositoryCourses);
    mapCourseToCardViewModelMock
      .mockReturnValueOnce(mappedCourses[0])
      .mockReturnValueOnce(mappedCourses[1]);

    const result = await getPublishedCourses();

    expect(findPublishedCoursesMock).toHaveBeenCalledTimes(1);
    expect(mapCourseToCardViewModelMock).toHaveBeenCalledTimes(2);
    expect(mapCourseToCardViewModelMock).toHaveBeenNthCalledWith(
      1,
      repositoryCourses[0],
      0,
      repositoryCourses,
    );
    expect(mapCourseToCardViewModelMock).toHaveBeenNthCalledWith(
      2,
      repositoryCourses[1],
      1,
      repositoryCourses,
    );
    expect(result).toEqual(mappedCourses);
  });
});
