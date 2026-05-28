import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClassroomLessonController } from "@/features/classroom/components/ClassroomLessonController";
import { requireAuthSession } from "@/lib/auth/guards";
import { getEnrolledCourseClassroom } from "@/server/use-cases/get-enrolled-course-classroom";

type ClassroomPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    lesson?: string | string[];
  }>;
};

export async function generateMetadata({
  params,
}: ClassroomPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Aula virtual - ${slug}`,
  };
}

export default async function ClassroomPage({
  params,
  searchParams,
}: ClassroomPageProps) {
  const [{ slug }, resolvedSearchParams, session] = await Promise.all([
    params,
    searchParams,
    requireAuthSession(),
  ]);

  const course = await getEnrolledCourseClassroom({
    userId: session.user.id,
    slug,
  });

  if (!course) {
    notFound();
  }

  const requestedLessonId =
    typeof resolvedSearchParams.lesson === "string"
      ? resolvedSearchParams.lesson
      : undefined;

  return (
    <ClassroomLessonController
      course={{
        slug: course.slug,
        title: course.title,
        subtitle: course.subtitle,
        lessons: course.lessons,
      }}
      initialLessonId={requestedLessonId}
    />
  );
}
