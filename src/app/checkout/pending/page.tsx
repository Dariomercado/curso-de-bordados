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
      title="Tu pago esta pendiente."
      description="Algunos medios de pago pueden demorar unos minutos en acreditarse. Cuando la confirmacion llegue, el acceso se actualizara automaticamente."
      note="No necesitas reenviar nada desde esta pantalla. Puedes revisar tu cuenta o volver al catalogo mientras esperamos la confirmacion del pago."
      primaryLink={{ href: "/mi-cuenta", label: "Ir a mi cuenta" }}
      secondaryLink={{ href: "/cursos", label: "Ver cursos" }}
    />
  );
}
