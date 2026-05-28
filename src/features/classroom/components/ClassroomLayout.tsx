import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ThreadAccent } from "@/components/ui/ThreadAccent";

type ClassroomLayoutProps = {
  title: string;
  description: string;
  sidebar: ReactNode;
  content: ReactNode;
};

export function ClassroomLayout({
  title,
  description,
  sidebar,
  content,
}: ClassroomLayoutProps) {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="classroom-heading">
      <Container>
        <SectionHeading
          id="classroom-heading"
          eyebrow="Area privada"
          title={title}
          description={description}
          action={
            <Button href="/mis-cursos" variant="secondary">
              Volver a mis cursos
            </Button>
          }
        />
        <ThreadAccent className="mt-8 h-7 w-32" />

        <div className="mt-10 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          <div className="order-2 lg:order-1">{sidebar}</div>
          <div className="order-1 lg:order-2">{content}</div>
        </div>
      </Container>
    </section>
  );
}
