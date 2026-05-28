"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";

type ContactFormProps = {
  submitLabel: string;
  successMessage: string;
};

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "message", string>>;

const initialErrors: FieldErrors = {};

export function ContactForm({
  submitLabel,
  successMessage,
}: ContactFormProps) {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<FieldErrors>(initialErrors);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  function submitForm(formData: FormData, form: HTMLFormElement) {
    startTransition(async () => {
      setErrors(initialErrors);
      setServerMessage(null);
      setIsSuccess(false);

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            message: formData.get("message"),
            source: "contact-page",
          }),
        });

        const payload = (await response.json()) as {
          message?: string;
          errors?: FieldErrors;
        };

        if (!response.ok) {
          setErrors(payload.errors ?? initialErrors);
          setServerMessage(
            payload.message ?? "No se pudo enviar la consulta. Intenta nuevamente.",
          );
          return;
        }

        form.reset();
        setIsSuccess(true);
        setServerMessage(payload.message ?? successMessage);
      } catch {
        setServerMessage("No se pudo enviar la consulta. Intenta nuevamente.");
      }
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitForm(new FormData(event.currentTarget), event.currentTarget);
  }

  return (
    <form
      className="rounded-[2rem] border border-border/70 bg-surface-strong p-6 shadow-soft sm:p-8"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="grid gap-5">
        <FormField
          id="name"
          label="Nombre"
          placeholder="Tu nombre"
          error={errors.name}
        />
        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="nombre@email.com"
          error={errors.email}
        />
        <FormField
          id="phone"
          label="Telefono"
          placeholder="Opcional"
          error={errors.phone}
        />
        <div>
          <label
            htmlFor="message"
            className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground-muted"
          >
            Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            placeholder="Contame en que te puedo ayudar."
            className="mt-2 w-full rounded-[1.5rem] border border-border/70 bg-background px-5 py-4 text-base text-foreground outline-none transition focus:border-brand"
          />
          {errors.message ? (
            <p className="mt-2 text-sm text-[color:rgb(150,74,74)]">{errors.message}</p>
          ) : null}
        </div>
      </div>

      {serverMessage ? (
        <p
          className={`mt-5 text-sm ${isSuccess ? "text-[color:rgb(63,111,74)]" : "text-[color:rgb(150,74,74)]"}`}
        >
          {serverMessage}
        </p>
      ) : null}

      <div className="mt-8">
        <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
          {isPending ? "Enviando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

type FormFieldProps = {
  id: "name" | "email" | "phone";
  label: string;
  placeholder: string;
  type?: "text" | "email";
  error?: string;
};

function FormField({
  id,
  label,
  placeholder,
  type = "text",
  error,
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
        className="mt-2 min-h-13 w-full rounded-full border border-border/70 bg-background px-5 text-base text-foreground outline-none transition focus:border-brand"
      />
      {error ? (
        <p className="mt-2 text-sm text-[color:rgb(150,74,74)]">{error}</p>
      ) : null}
    </div>
  );
}
