export type CourseLevel = "Principiante" | "Intermedio" | "Avanzado";

export type Course = {
  slug: string;
  title: string;
  description: string;
  level: CourseLevel;
  duration: string;
  price: string;
  content: string[];
  image: {
    src: string;
    alt: string;
  };
  href: string;
};
