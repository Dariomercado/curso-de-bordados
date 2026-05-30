"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { type FormEvent, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { loginInputSchema } from "@/lib/validations/login";

type FieldErrors = Partial<Record<"email" | "password", string>>;

const initialErrors: FieldErrors = {};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<FieldErrors>(initialErrors);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const rawEmail = (form.elements.namedItem("email") as HTMLInputElement).value;
    const rawPassword = (form.elements.namedItem("password") as HTMLInputElement).value;

    setErrors(initialErrors);
    setServerMessage(null);

    const parsed = loginInputSchema.safeParse({
      email: rawEmail,
      password: rawPassword,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    const callbackUrl = searchParams.get("callbackUrl") ?? "/mi-cuenta";

    startTransition(async () => {
      const result = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
        callbackUrl,
      });

      if (!result || result.error) {
        setServerMessage(
          "No pudimos ingresar con esos datos. Revisa el email y la contrasena, o activa tu acceso si compraste sin crear cuenta.",
        );
        return;
      }

      router.replace(result.url ?? callbackUrl);
      router.refresh();
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
        <FormField
          id="password"
          label="Contraseña"
          type="password"
          placeholder="Tu contraseña"
          error={errors.password}
        />
      </div>

      {serverMessage ? (
        <p className="mt-5 text-sm text-[color:rgb(150,74,74)]">{serverMessage}</p>
      ) : null}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/recuperar-contrasena"
          className="text-sm font-semibold text-brand hover:text-brand-strong"
        >
          Olvide mi contrasena / activar acceso
        </Link>
        <Link
          href="/registro"
          className="text-sm font-semibold text-brand hover:text-brand-strong"
        >
          ¿No tenes cuenta? Crear cuenta
        </Link>
      </div>

      <div className="mt-8">
        <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
          {isPending ? "Ingresando..." : "Ingresar"}
        </Button>
      </div>
    </form>
  );
}

type FormFieldProps = {
  id: "email" | "password";
  label: string;
  placeholder: string;
  type: "email" | "password";
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
