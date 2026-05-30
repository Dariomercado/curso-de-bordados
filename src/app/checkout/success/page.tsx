import type { Metadata } from "next";
import { CheckoutReturnPage } from "@/app/checkout/_components/CheckoutReturnPage";

export const metadata: Metadata = {
  title: "Pago recibido",
  description: "Confirmacion de retorno despues de un pago en Mercado Pago.",
};

export default function CheckoutSuccessPage() {
  return (
    <CheckoutReturnPage
      eyebrow="Checkout"
      title="Pago recibido. Estamos habilitando tu acceso."
      description="La confirmacion final llega por Mercado Pago y puede tardar unos segundos. Cuando se acredite, tu curso quedara asociado al email que usaste para comprar."
      note="Si ya tenes cuenta, ingresa con ese email. Si compraste por primera vez, crea tu contrasena desde Activar acceso para entrar a tus cursos."
      primaryLink={{
        href: "/recuperar-contrasena",
        label: "Activar acceso / crear contrasena",
        className: "min-h-14 text-base sm:min-h-16 sm:px-8 sm:text-base",
      }}
      secondaryLink={{ href: "/mis-cursos", label: "Ya tengo cuenta: ir a mis cursos" }}
    />
  );
}
