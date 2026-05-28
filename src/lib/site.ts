const LOCAL_SITE_URL = "http://localhost:3000";

export const siteConfig = {
  name: "Atelier de Bordado",
  description:
    "Cursos online de bordado artesanal con una experiencia cálida, elegante y cercana.",
};

export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!siteUrl) {
    return LOCAL_SITE_URL;
  }

  return siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
}
