import { mapCourseToCardViewModel } from "@/features/courses/mappers/course-view-model";
import { findPublishedCourseBySlug } from "@/server/repositories/course-repository";

export async function getPublishedCourseBySlug(slug: string) {
  const course = await findPublishedCourseBySlug(slug);

  if (!course) {
    return null;
  }

  return mapCourseToCardViewModel(course);
}
