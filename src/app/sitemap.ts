import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { findPublishedCourseSlugs } from "@/server/repositories/course-repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const publishedCourses = await findPublishedCourseSlugs();

  const staticRoutes: MetadataRoute.Sitemap = ["", "/cursos", "/contacto", "/sobre-mi"].map(
    (path) => ({
      url: `${siteUrl}${path}`,
    }),
  );

  const courseRoutes: MetadataRoute.Sitemap = publishedCourses.map((course) => ({
    url: `${siteUrl}/cursos/${course.slug}`,
  }));

  return [...staticRoutes, ...courseRoutes];
}
