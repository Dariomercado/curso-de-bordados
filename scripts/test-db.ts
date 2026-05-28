import "dotenv/config";
import { prisma } from "../src/lib/db/prisma";

async function main() {
  console.log("🚀 Probando conexión a la base...");

  const userCount = await prisma.user.count();

  console.log("✅ Conexión OK");
  console.log("Usuarios en la base:", userCount);

  const courses = await prisma.course.findMany();

  console.log("Cursos encontrados:", courses.length);
  console.log(courses);
}

main()
  .catch((error) => {
    console.error("❌ Error:");
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
