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
      title="Pago recibido. Tu acceso se habilita automaticamente."
      description="La confirmacion depende del sistema y puede tardar unos segundos mientras validamos el pago y habilitamos tu curso."
      note="Esta pantalla no otorga acceso por si sola. Cuando la confirmacion termine, tu curso aparecera automaticamente en Mis cursos."
      primaryLink={{
        href: "/mis-cursos",
        label: "Ir a mis cursos",
        className: "min-h-14 text-base sm:min-h-16 sm:px-8 sm:text-base",
      }}
      secondaryLink={{ href: "/cursos", label: "Ver mas cursos" }}
    />
  );
}
