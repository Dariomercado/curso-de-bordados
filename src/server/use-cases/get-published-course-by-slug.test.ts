import { beforeEach, describe, expect, it, vi } from "vitest";

const { findPublishedCourseBySlugMock, mapCourseToCardViewModelMock } = vi.hoisted(() => ({
  findPublishedCourseBySlugMock: vi.fn(),
  mapCourseToCardViewModelMock: vi.fn(),
}));

vi.mock("@/server/repositories/course-repository", () => ({
  findPublishedCourseBySlug: findPublishedCourseBySlugMock,
}));

vi.mock("@/features/courses/mappers/course-view-model", () => ({
  mapCourseToCardViewModel: mapCourseToCardViewModelMock,
}));

import { getPublishedCourseBySlug } from "@/server/use-cases/get-published-course-by-slug";

describe("getPublishedCourseBySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the mapped course when the repository finds it", async () => {
    const repositoryCourse = { slug: "curso-1", title: "Curso 1" };
    const mappedCourse = { slug: "curso-1", href: "/cursos/curso-1" };

    findPublishedCourseBySlugMock.mockResolvedValue(repositoryCourse);
    mapCourseToCardViewModelMock.mockReturnValue(mappedCourse);

    const result = await getPublishedCourseBySlug("curso-1");

    expect(findPublishedCourseBySlugMock).toHaveBeenCalledTimes(1);
    expect(findPublishedCourseBySlugMock).toHaveBeenCalledWith("curso-1");
    expect(mapCourseToCardViewModelMock).toHaveBeenCalledTimes(1);
    expect(mapCourseToCardViewModelMock).toHaveBeenCalledWith(repositoryCourse);
    expect(result).toEqual(mappedCourse);
  });

  it("returns null when the repository does not find the course", async () => {
    findPublishedCourseBySlugMock.mockResolvedValue(null);

    const result = await getPublishedCourseBySlug("inexistente");

    expect(findPublishedCourseBySlugMock).toHaveBeenCalledTimes(1);
    expect(findPublishedCourseBySlugMock).toHaveBeenCalledWith("inexistente");
    expect(mapCourseToCardViewModelMock).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
