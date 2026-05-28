import { Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { createCheckoutPreference } from "@/lib/payments/mercadopago/client";
import { findUserByEmail, findEnrollmentByUserIdAndCourseId } from "@/server/repositories/enrollment-repository";
import { createOrderWithItem, updateOrderMercadoPagoPreferenceId } from "@/server/repositories/order-repository";
import { findCheckoutCourseBySlug } from "@/server/repositories/course-repository";
import type { UseCaseResult } from "@/server/use-cases/use-case-result";

const startCourseCheckoutSchema = z.object({
  courseSlug: z.string().trim().min(1, "El curso es obligatorio."),
  buyerEmail: z
    .string()
    .trim()
    .min(1, "Ingresa tu email.")
    .email("Ingresa un email valido.")
    .transform((value) => value.toLowerCase()),
});

type StartCourseCheckoutInput = z.output<typeof startCourseCheckoutSchema>;

type StartCourseCheckoutData = {
  orderId: string;
  externalReference: string;
  preferenceId: string;
  initPoint: string | null;
  sandboxInitPoint: string | null;
};

export async function startCourseCheckout(
  input: unknown,
): Promise<UseCaseResult<StartCourseCheckoutData>> {
  const validationResult = startCourseCheckoutSchema.safeParse(input);

  if (!validationResult.success) {
    const errors: Record<string, string> = {};

    for (const issue of validationResult.error.issues) {
      const field = issue.path[0];

      if (typeof field === "string") {
        errors[field] = issue.message;
      }
    }

    return {
      success: false,
      status: 400,
      message: "No se pudo iniciar la compra.",
      errors,
    };
  }

  return startValidatedCourseCheckout(validationResult.data);
}

async function startValidatedCourseCheckout(
  input: StartCourseCheckoutInput,
): Promise<UseCaseResult<StartCourseCheckoutData>> {
  const course = await findCheckoutCourseBySlug(input.courseSlug);

  if (!course) {
    return {
      success: false,
      status: 404,
      message: "El curso no existe o no esta disponible.",
    };
  }

  if (!course.price || course.price.lte(new Prisma.Decimal(0))) {
    return {
      success: false,
      status: 400,
      message: "Este curso no esta disponible para compra.",
    };
  }

  const existingUser = await findUserByEmail(input.buyerEmail);

  if (existingUser) {
    const existingEnrollment = await findEnrollmentByUserIdAndCourseId(existingUser.id, course.id);

    if (existingEnrollment) {
      return {
        success: false,
        status: 409,
        message: "Este email ya tiene acceso a este curso.",
      };
    }
  }

  const externalReference = `order_${randomUUID()}`;

  const order = await createOrderWithItem({
    buyerEmail: input.buyerEmail,
    externalReference,
    total: course.price,
    item: {
      productId: course.id,
      title: course.title,
      price: course.price,
    },
  });

  try {
    const preference = await createCheckoutPreference({
      externalReference,
      buyerEmail: input.buyerEmail,
      item: {
        id: course.id,
        title: course.title,
        unitPrice: course.price.toNumber(),
        quantity: 1,
      },
    });

    await updateOrderMercadoPagoPreferenceId(order.id, preference.preferenceId);

    return {
      success: true,
      status: 201,
      message: "Checkout iniciado correctamente.",
      data: {
        orderId: order.id,
        externalReference,
        preferenceId: preference.preferenceId,
        initPoint: preference.initPoint,
        sandboxInitPoint: preference.sandboxInitPoint,
      },
    };
  } catch (error) {
    console.error("[mercadopago] Checkout start failed", {
      courseSlug: input.courseSlug,
      buyerEmail: input.buyerEmail,
      externalReference,
      orderId: order.id,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });

    return {
      success: false,
      status: 502,
      message:
        error instanceof Error
          ? error.message
          : "No se pudo iniciar el checkout en este momento.",
    };
  }
}
