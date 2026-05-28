import { CourseStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export async function findPublishedCourses() {
  return prisma.course.findMany({
    where: {
      status: CourseStatus.PUBLISHED,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function findFeaturedPublishedCourses() {
  return prisma.course.findMany({
    where: {
      status: CourseStatus.PUBLISHED,
      isFeatured: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function findPublishedCourseSlugs() {
  return prisma.course.findMany({
    where: {
      status: CourseStatus.PUBLISHED,
    },
    select: {
      slug: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function findPublishedCourseBySlug(slug: string) {
  return prisma.course.findFirst({
    where: {
      slug,
      status: CourseStatus.PUBLISHED,
    },
    include: {
      lessons: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });
}

export async function findCheckoutCourseBySlug(slug: string) {
  return prisma.course.findFirst({
    where: {
      slug,
      status: CourseStatus.PUBLISHED,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      price: true,
    },
  });
}
