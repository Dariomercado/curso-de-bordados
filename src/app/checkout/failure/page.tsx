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
      title="El pago no se completo."
      description="No recibimos un pago aprobado para esta compra. Podes intentarlo nuevamente desde el curso o escribirnos si necesitas ayuda."
      note="Si Mercado Pago muestra algun movimiento en tu cuenta, no vuelvas a pagar todavia: contactanos para revisarlo."
      primaryLink={{ href: "/cursos", label: "Volver a cursos" }}
      secondaryLink={{ href: "/contacto", label: "Necesito ayuda" }}
    />
  );
}
