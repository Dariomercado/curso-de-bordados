import {
  findPublishedCoursesForEnrollment,
  findUsersWithEnrollments,
} from "@/server/repositories/enrollment-repository";
import type { UseCaseResult } from "@/server/use-cases/use-case-result";

type AdminUsersWithEnrollmentsData = {
  users: Array<{
    id: string;
    name: string | null;
    email: string;
    role: "ADMIN" | "STUDENT";
    isActive: boolean;
    enrollmentsCount: number;
    enrollments: Array<{
      id: string;
      accessGrantedAt: string;
      course: {
        id: string;
        title: string;
        slug: string;
      };
    }>;
    availableCourses: Array<{
      id: string;
      title: string;
      slug: string;
    }>;
  }>;
};

export async function getAdminUsersWithEnrollments(): Promise<
  UseCaseResult<AdminUsersWithEnrollmentsData>
> {
  const [users, publishedCourses] = await Promise.all([
    findUsersWithEnrollments(),
    findPublishedCoursesForEnrollment(),
  ]);

  return {
    success: true,
    status: 200,
    message: "Usuarios cargados correctamente.",
    data: {
      users: users.map((user) => {
        const assignedCourseIds = new Set(user.enrollments.map((enrollment) => enrollment.courseId));

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          enrollmentsCount: user._count.enrollments,
          enrollments: user.enrollments.map((enrollment) => ({
            id: enrollment.id,
            accessGrantedAt: enrollment.accessGrantedAt.toISOString(),
            course: enrollment.course,
          })),
          availableCourses: publishedCourses.filter((course) => !assignedCourseIds.has(course.id)),
        };
      }),
    },
  };
}
