import type { Metadata } from "next";
import { CheckoutReturnPage } from "@/app/checkout/_components/CheckoutReturnPage";

export const metadata: Metadata = {
  title: "Pago no procesado",
  description: "Retorno de pago no completado desde Mercado Pago.",
};

export default function CheckoutFailurePage() {
  return (
    <CheckoutReturnPage
      eyebrow="Checkout"
      title="No pudimos procesar el pago."
      description="Esta pantalla no confirma acceso ni modifica tu pedido. Si quieres, puedes intentar nuevamente desde el curso o escribirnos para ayudarte."
      note="Si el problema persiste, revisa el medio de pago elegido o contactanos para orientarte antes de volver a intentarlo."
      primaryLink={{ href: "/cursos", label: "Volver a cursos" }}
      secondaryLink={{ href: "/contacto", label: "Ir a contacto" }}
    />
  );
}
