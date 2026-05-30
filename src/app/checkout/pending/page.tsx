import type { Metadata } from "next";
import { CheckoutReturnPage } from "@/app/checkout/_components/CheckoutReturnPage";

export const metadata: Metadata = {
  title: "Pago pendiente",
  description: "Estado pendiente despues del retorno de Mercado Pago.",
};

export default function CheckoutPendingPage() {
  return (
    <CheckoutReturnPage
      eyebrow="Checkout"
      title="Tu pago esta pendiente de confirmacion."
      description="Algunos medios de pago pueden demorar unos minutos. No hace falta volver a comprar: cuando Mercado Pago confirme el pago, habilitaremos el curso en el email usado durante la compra."
      note="Si es tu primera compra, podes activar tu acceso creando una contrasena. Si el curso todavia no aparece, espera unos minutos y vuelve a revisar."
      primaryLink={{ href: "/recuperar-contrasena", label: "Activar acceso" }}
      secondaryLink={{ href: "/mis-cursos", label: "Ver mis cursos" }}
    />
  );
}
