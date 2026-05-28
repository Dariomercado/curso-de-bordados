"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { resetPasswordInputSchema } from "@/lib/validations/reset-password";

type FieldErrors = Partial<Record<"password" | "confirmPassword", string>>;

const initialErrors: FieldErrors = {};
const INVALID_TOKEN_MESSAGE = "El enlace no es valido o expiro.";

type ResetPasswordFormProps = {
  initialToken?: string;
};

export function ResetPasswordForm({ initialToken = "" }: ResetPasswordFormProps) {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<FieldErrors>(initialErrors);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const token = initialToken.trim();
  const hasToken = token.length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasToken) {
      setServerMessage(INVALID_TOKEN_MESSAGE);
      setIsSuccess(false);
      return;
    }

    const form = event.currentTarget;
    const rawPassword = (form.elements.namedItem("password") as HTMLInputElement).value;
    const rawConfirmPassword = (
      form.elements.namedItem("confirmPassword") as HTMLInputElement
    ).value;

    setErrors(initialErrors);
    setServerMessage(null);
    setIsSuccess(false);

    const parsed = resetPasswordInputSchema.safeParse({
      token,
      password: rawPassword,
      confirmPassword: rawConfirmPassword,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      setErrors({
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });

      if (fieldErrors.token?.[0]) {
        setServerMessage(fieldErrors.token[0]);
      }

      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/password/reset", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsed.data),
        });

        const payload = (await response.json()) as {
          message?: string;
          errors?: FieldErrors;
        };

        if (!response.ok) {
          setErrors(payload.errors ?? initialErrors);
          setServerMessage(
            payload.message ?? "No se pudo restablecer la contrasena. Intenta nuevamente.",
          );
          return;
        }

        form.reset();
        setIsSuccess(true);
        setServerMessage(
          payload.message ??
            "Tu contrasena fue actualizada correctamente. Ya puedes iniciar sesion.",
        );
      } catch {
        setServerMessage("No se pudo restablecer la contrasena. Intenta nuevamente.");
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
          id="password"
          label="Nueva contrasena"
          type="password"
          placeholder="Minimo 8 caracteres"
          error={errors.password}
          disabled={!hasToken || isSuccess}
        />
        <FormField
          id="confirmPassword"
          label="Confirmar contrasena"
          type="password"
          placeholder="Repite tu nueva contrasena"
          error={errors.confirmPassword}
          disabled={!hasToken || isSuccess}
        />
      </div>

      {!hasToken && !serverMessage ? (
        <p className="mt-5 text-sm text-[color:rgb(150,74,74)]">{INVALID_TOKEN_MESSAGE}</p>
      ) : null}

      {serverMessage ? (
        <p
          className={`mt-5 text-sm ${isSuccess ? "text-[color:rgb(63,111,74)]" : "text-[color:rgb(150,74,74)]"}`}
        >
          {serverMessage}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button
          type="submit"
          className="w-full sm:w-auto"
          disabled={isPending || !hasToken || isSuccess}
        >
          {isPending ? "Actualizando..." : "Restablecer contrasena"}
        </Button>
        <Link
          href={isSuccess ? "/login" : "/recuperar-contrasena"}
          className="text-sm font-semibold text-brand hover:text-brand-strong"
        >
          {isSuccess ? "Ir a ingresar" : "Solicitar otro enlace"}
        </Link>
      </div>
    </form>
  );
}

type FormFieldProps = {
  id: "password" | "confirmPassword";
  label: string;
  placeholder: string;
  type: "password";
  error?: string;
  disabled?: boolean;
};

function FormField({
  id,
  label,
  placeholder,
  type,
  error,
  disabled,
}: FormFieldProps) {
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
        disabled={disabled}
        className="mt-2 min-h-13 w-full rounded-full border border-border/70 bg-background px-5 text-base text-foreground outline-none transition focus:border-brand disabled:cursor-not-allowed disabled:opacity-60"
      />
      {error ? (
        <p className="mt-2 text-sm text-[color:rgb(150,74,74)]">{error}</p>
      ) : null}
    </div>
  );
}
