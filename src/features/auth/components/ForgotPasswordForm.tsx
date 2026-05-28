"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { forgotPasswordInputSchema } from "@/lib/validations/forgot-password";

type FieldErrors = Partial<Record<"email", string>>;
type ForgotPasswordDevPreview = {
  resetUrl?: string;
};

const initialErrors: FieldErrors = {};

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<FieldErrors>(initialErrors);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [devPreview, setDevPreview] = useState<ForgotPasswordDevPreview | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const rawEmail = (form.elements.namedItem("email") as HTMLInputElement).value;

    setErrors(initialErrors);
    setServerMessage(null);
    setIsSuccess(false);
    setDevPreview(null);

    const parsed = forgotPasswordInputSchema.safeParse({
      email: rawEmail.trim().toLowerCase(),
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      setErrors({
        email: fieldErrors.email?.[0],
      });
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/password/forgot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsed.data),
        });

        const payload = (await response.json()) as {
          message?: string;
          errors?: FieldErrors;
          devPreview?: ForgotPasswordDevPreview;
        };

        if (!response.ok) {
          setErrors(payload.errors ?? initialErrors);
          setServerMessage(
            payload.message ?? "No se pudo procesar la solicitud. Intenta nuevamente.",
          );
          return;
        }

        form.reset();
        setIsSuccess(true);
        setDevPreview(payload.devPreview ?? null);
        setServerMessage(
          payload.message ??
            "Si el email existe, te enviamos instrucciones para restablecer tu contrasena.",
        );
      } catch {
        setServerMessage("No se pudo procesar la solicitud. Intenta nuevamente.");
      }
    });
  }

  return (
    <form
      className="rounded-[2rem] border border-border/70 bg-surface-strong p-6 shadow-soft sm:p-8"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="grid gap-5">
        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="nombre@email.com"
          error={errors.email}
        />
      </div>

      {serverMessage ? (
        <div className="mt-5 space-y-3">
          <p
            className={`text-sm ${isSuccess ? "text-[color:rgb(63,111,74)]" : "text-[color:rgb(150,74,74)]"}`}
          >
            {serverMessage}
          </p>
          {isSuccess && devPreview?.resetUrl ? (
            <a
              href={devPreview.resetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-sm font-semibold text-brand hover:text-brand-strong"
            >
              Abrir enlace de restablecimiento
            </a>
          ) : null}
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
          {isPending ? "Enviando..." : "Enviar instrucciones"}
        </Button>
        <Link
          href="/login"
          className="text-sm font-semibold text-brand hover:text-brand-strong"
        >
          Volver a ingresar
        </Link>
      </div>
    </form>
  );
}

type FormFieldProps = {
  id: "email";
  label: string;
  placeholder: string;
  type: "email";
  error?: string;
};

function FormField({ id, label, placeholder, type, error }: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground-muted"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        className="mt-2 min-h-13 w-full rounded-full border border-border/70 bg-background px-5 text-base text-foreground outline-none transition focus:border-brand"
      />
      {error ? (
        <p className="mt-2 text-sm text-[color:rgb(150,74,74)]">{error}</p>
      ) : null}
    </div>
  );
}
