"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type CourseCheckoutInlineProps = {
  courseSlug: string;
  courseTitle: string;
  initialEmail?: string;
};

type CheckoutResponse = {
  success: boolean;
  message: string;
  data?: {
    initPoint?: string | null;
    sandboxInitPoint?: string | null;
  } | null;
  errors?: Record<string, string>;
};

export function CourseCheckoutInline({
  courseSlug,
  courseTitle,
  initialEmail = "",
}: CourseCheckoutInlineProps) {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/payments/mercadopago/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseSlug,
          buyerEmail: email,
        }),
      });

      const result = (await response.json()) as CheckoutResponse;

      if (!response.ok || !result.success) {
        setError(
          result.errors?.buyerEmail ??
            result.message ??
            "No se pudo iniciar el checkout. Intenta nuevamente.",
        );
        return;
      }

      const redirectUrl = result.data?.initPoint ?? result.data?.sandboxInitPoint ?? null;

      if (!redirectUrl) {
        setError("No se recibio una URL valida para continuar al pago.");
        return;
      }

      window.location.assign(redirectUrl);
    } catch {
      setError("No se pudo iniciar el checkout. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-8 rounded-[1.5rem] border border-border/70 bg-surface-strong/70 p-4 sm:p-5">
      <p className="text-sm leading-6 text-foreground-muted">
        Ingresa tu email para continuar con la compra de{" "}
        <span className="font-semibold text-foreground">{courseTitle}</span>.
      </p>

      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">
            Email
          </span>
          <input
            type="email"
            name="buyerEmail"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tuemail@ejemplo.com"
            className="min-h-12 w-full rounded-2xl border border-border/80 bg-background px-4 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </label>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Redirigiendo..." : "Continuar al pago"}
        </Button>
      </form>

      {error ? (
        <p
          role="alert"
          className="mt-3 rounded-2xl border border-[color:rgba(166,85,78,0.22)] bg-[color:rgba(166,85,78,0.08)] px-4 py-3 text-sm text-[color:rgb(128,62,57)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
