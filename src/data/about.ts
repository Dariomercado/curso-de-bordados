import type { AboutPreviewContent } from "@/types/about";

export const aboutPreviewContent: AboutPreviewContent = {
  title:
    "Hola, soy Clara. Creo que todos tenemos una historia que contar a través de los hilos.",
  highlightedWord: "historia",
  paragraphs: [
    "Hace más de 10 años que el bordado llegó a mi vida para enseñarme que la paciencia es una forma de amor. Lo que empezó como un hobby terapéutico se convirtió en mi Atelier, un espacio donde comparto técnicas y secretos con miles de alumnas en todo el mundo.",
    "Enseño con calma, valorando el proceso por sobre el resultado perfecto. Mi misión es que te reencuentres con tus manos y descubras que sos capaz de crear belleza desde cero.",
  ],
  signature: "Fundadora de Atelier de Bordado",
  image: {
    src: "/about-clara.svg",
    alt: "Retrato cálido de Clara sosteniendo un bastidor bordado en su taller.",
  },
};

export const aboutPageContent = {
  eyebrow: "Sobre mí",
  title: "Un atelier nacido del deseo de crear con calma.",
  introduction:
    "Mi vínculo con el bordado empezó como un refugio pequeño y cotidiano. Con el tiempo se convirtió en una forma de enseñar, acompañar y construir una comunidad de mujeres que vuelven a confiar en sus manos.",
  sections: [
    {
      title: "Cómo empezó todo",
      paragraphs: [
        "Durante años bordé en silencio, explorando materiales, cuadernos de puntadas y combinaciones de color en tiempos lentos. Ese proceso me mostró que la paciencia no es una espera vacía, sino una manera de habitar el presente.",
        "Con el tiempo empecé a compartir lo que aprendía con amigas y alumnas cercanas. De ahí nació Atelier de Bordado: un espacio para enseñar sin apuro, con claridad y sensibilidad.",
      ],
    },
    {
      title: "Qué busco transmitir",
      paragraphs: [
        "No me interesa la perfección rígida. Me interesa que cada persona encuentre un ritmo propio, disfrute el proceso y descubra que puede construir belleza puntada a puntada.",
        "Cada curso y cada kit están pensados para acompañar ese recorrido: materiales nobles, explicaciones claras y una estética cálida que invite a quedarse.",
      ],
    },
  ],
};
