import { CourseStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export async function findEnrolledCourseClassroomBySlug(input: {
  userId: string;
  slug: string;
}) {
  return prisma.course.findFirst({
    where: {
      slug: input.slug,
      status: CourseStatus.PUBLISHED,
      enrollments: {
        some: {
          userId: input.userId,
        },
      },
    },
    select: {
      id: true,
      slug: true,
      title: true,
      subtitle: true,
      description: true,
      coverImage: true,
      lessons: {
        select: {
          id: true,
          title: true,
          content: true,
          videoUrl: true,
          position: true,
          isPreview: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
}
