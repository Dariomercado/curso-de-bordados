import Image from "next/image";
import { Button } from "@/components/ui/Button";
import type { Kit } from "@/types/kit";

type KitCardProps = {
  kit: Kit;
};

export function KitCard({ kit }: KitCardProps) {
  return (
    <article className="text-center">
      <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-surface-strong shadow-soft">
        <Image
          src={kit.image.src}
          alt={kit.image.alt}
          width={720}
          height={720}
          className="aspect-square h-auto w-full object-cover"
        />
      </div>

      <div className="px-4 pb-2 pt-6">
        <h3 className="font-heading text-3xl leading-tight text-foreground">
          {kit.title}
        </h3>
        <p className="mt-4 text-base leading-7 text-foreground-muted">
          {kit.description}
        </p>
        <p className="mt-5 font-heading text-4xl leading-none text-brand">
          {kit.price}
        </p>
        <div className="mt-5">
          <Button href={kit.href} variant="secondary" size="sm">
            Comprar kit
          </Button>
        </div>
      </div>
    </article>
  );
}
