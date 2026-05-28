import { findEnrolledCourseClassroomBySlug } from "@/server/repositories/classroom-repository";

export type EnrolledCourseClassroomViewModel = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  coverImage: string | null;
  lessons: Array<{
    id: string;
    title: string;
    content: string | null;
    videoUrl: string | null;
    position: number;
    isPreview: boolean;
  }>;
};

export async function getEnrolledCourseClassroom(input: {
  userId: string;
  slug: string;
}): Promise<EnrolledCourseClassroomViewModel | null> {
  const course = await findEnrolledCourseClassroomBySlug(input);

  if (!course) {
    return null;
  }

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    subtitle: course.subtitle,
    description: course.description,
    coverImage: course.coverImage,
    lessons: course.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      content: lesson.content,
      videoUrl: lesson.videoUrl,
      position: lesson.position,
      isPreview: lesson.isPreview,
    })),
  };
}
