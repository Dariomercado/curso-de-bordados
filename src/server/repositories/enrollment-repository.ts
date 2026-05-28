import { CourseStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

function getDb(db?: Prisma.TransactionClient) {
  return db ?? prisma;
}

export async function findUsersWithEnrollments() {
  return prisma.user.findMany({
    include: {
      _count: {
        select: {
          enrollments: true,
        },
      },
      enrollments: {
        select: {
          id: true,
          courseId: true,
          accessGrantedAt: true,
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
        orderBy: {
          accessGrantedAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function findPublishedCoursesForEnrollment() {
  return prisma.course.findMany({
    where: {
      status: CourseStatus.PUBLISHED,
    },
    select: {
      id: true,
      title: true,
      slug: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });
}

export async function findUserByEmail(email: string) {
  return getDb().user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
}

export async function findPublishedCourseById(id: string) {
  return prisma.course.findFirst({
    where: {
      id,
      status: CourseStatus.PUBLISHED,
    },
    select: {
      id: true,
    },
  });
}

export async function findEnrollmentByUserIdAndCourseId(userId: string, courseId: string) {
  return prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    select: {
      id: true,
    },
  });
}

export async function createEnrollment(userId: string, courseId: string) {
  return getDb().enrollment.create({
    data: {
      userId,
      courseId,
    },
    select: {
      id: true,
    },
  });
}

export async function findEnrollmentById(id: string) {
  return getDb().enrollment.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });
}

export async function deleteEnrollmentById(id: string) {
  return getDb().enrollment.delete({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });
}

export async function createEnrollmentIfMissing(
  userId: string,
  courseId: string,
  db?: Prisma.TransactionClient,
) {
  return getDb(db).enrollment.upsert({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    update: {},
    create: {
      userId,
      courseId,
    },
    select: {
      id: true,
      userId: true,
      courseId: true,
    },
  });
}
