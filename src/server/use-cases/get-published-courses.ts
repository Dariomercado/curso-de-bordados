import { mapCourseToCardViewModel } from "@/features/courses/mappers/course-view-model";
import { findPublishedCourses } from "@/server/repositories/course-repository";

export async function getPublishedCourses() {
  const courses = await findPublishedCourses();

  return courses.map(mapCourseToCardViewModel);
}
