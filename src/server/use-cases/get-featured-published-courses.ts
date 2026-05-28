import { mapCourseToCardViewModel } from "@/features/courses/mappers/course-view-model";
import { findFeaturedPublishedCourses } from "@/server/repositories/course-repository";

export async function getFeaturedPublishedCourses() {
  const courses = await findFeaturedPublishedCourses();

  return courses.map(mapCourseToCardViewModel);
}
