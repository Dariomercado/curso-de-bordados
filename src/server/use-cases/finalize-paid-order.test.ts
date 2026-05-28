import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  transactionMock,
  findOrderByExternalReferenceForFulfillmentMock,
  upsertUserByEmailMock,
  createEnrollmentIfMissingMock,
  markOrderPaidMock,
} = vi.hoisted(() => ({
  transactionMock: vi.fn(),
  findOrderByExternalReferenceForFulfillmentMock: vi.fn(),
  upsertUserByEmailMock: vi.fn(),
  createEnrollmentIfMissingMock: vi.fn(),
  markOrderPaidMock: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    $transaction: transactionMock,
  },
}));

vi.mock("@/server/repositories/order-repository", () => ({
  findOrderByExternalReferenceForFulfillment:
    findOrderByExternalReferenceForFulfillmentMock,
  markOrderPaid: markOrderPaidMock,
}));

vi.mock("@/server/repositories/user-repository", () => ({
  upsertUserByEmail: upsertUserByEmailMock,
}));

vi.mock("@/server/repositories/enrollment-repository", () => ({
  createEnrollmentIfMissing: createEnrollmentIfMissingMock,
}));

import { OrderStatus, ProductType, Prisma } from "@prisma/client";
import { finalizePaidOrder } from "@/server/use-cases/finalize-paid-order";

describe("finalizePaidOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    transactionMock.mockImplementation(async (callback: (tx: object) => unknown) =>
      callback({}),
    );
  });

  it("returns 404 when the order does not exist", async () => {
    findOrderByExternalReferenceForFulfillmentMock.mockResolvedValue(null);

    const result = await finalizePaidOrder({
      mercadoPagoPaymentId: "pay-1",
      externalReference: "order_1",
      paymentStatus: "approved",
      currencyId: "ARS",
      paidAmount: 100,
      payerEmail: "buyer@example.com",
    });

    expect(result).toEqual({
      success: false,
      status: 404,
      message: "No existe una orden para la referencia externa recibida.",
    });
  });

  it("returns idempotent success when the order is already paid with the same payment", async () => {
    findOrderByExternalReferenceForFulfillmentMock.mockResolvedValue({
      id: "order-db-1",
      buyerEmail: "buyer@example.com",
      userId: "user-1",
      externalReference: "order_1",
      mercadoPagoPaymentId: "pay-1",
      status: OrderStatus.PAID,
      total: new Prisma.Decimal(100),
      items: [],
    });

    const result = await finalizePaidOrder({
      mercadoPagoPaymentId: "pay-1",
      externalReference: "order_1",
      paymentStatus: "approved",
      currencyId: "ARS",
      paidAmount: 100,
      payerEmail: "buyer@example.com",
    });

    expect(result).toEqual({
      success: true,
      status: 200,
      message: "La orden ya habia sido finalizada previamente.",
      data: {
        orderId: "order-db-1",
        userId: "user-1",
        mercadoPagoPaymentId: "pay-1",
      },
    });
    expect(transactionMock).not.toHaveBeenCalled();
  });

  it("returns 409 when the order is already paid with another payment", async () => {
    findOrderByExternalReferenceForFulfillmentMock.mockResolvedValue({
      id: "order-db-1",
      buyerEmail: "buyer@example.com",
      userId: "user-1",
      externalReference: "order_1",
      mercadoPagoPaymentId: "pay-2",
      status: OrderStatus.PAID,
      total: new Prisma.Decimal(100),
      items: [],
    });

    const result = await finalizePaidOrder({
      mercadoPagoPaymentId: "pay-1",
      externalReference: "order_1",
      paymentStatus: "approved",
      currencyId: "ARS",
      paidAmount: 100,
      payerEmail: "buyer@example.com",
    });

    expect(result).toEqual({
      success: false,
      status: 409,
      message: "La orden ya esta asociada a otro pago aprobado.",
    });
  });

  it("creates or reuses the user, grants enrollment idempotently and marks the order as paid at the end", async () => {
    findOrderByExternalReferenceForFulfillmentMock.mockResolvedValue({
      id: "order-db-1",
      buyerEmail: "buyer@example.com",
      userId: null,
      externalReference: "order_1",
      mercadoPagoPaymentId: null,
      status: OrderStatus.PENDING,
      total: new Prisma.Decimal(100),
      items: [
        {
          id: "item-1",
          productId: "course-1",
          type: ProductType.COURSE,
          title: "Curso 1",
          quantity: 1,
        },
      ],
    });
    upsertUserByEmailMock.mockResolvedValue({
      id: "user-1",
      email: "buyer@example.com",
    });
    createEnrollmentIfMissingMock.mockResolvedValue({
      id: "enrollment-1",
      userId: "user-1",
      courseId: "course-1",
    });
    markOrderPaidMock.mockResolvedValue({
      id: "order-db-1",
      userId: "user-1",
      mercadoPagoPaymentId: "pay-1",
      status: OrderStatus.PAID,
    });

    const result = await finalizePaidOrder({
      mercadoPagoPaymentId: "pay-1",
      externalReference: "order_1",
      paymentStatus: "approved",
      currencyId: "ARS",
      paidAmount: 100,
      payerEmail: "buyer@example.com",
    });

    expect(upsertUserByEmailMock).toHaveBeenCalledTimes(1);
    expect(createEnrollmentIfMissingMock).toHaveBeenCalledWith("user-1", "course-1", {});
    expect(markOrderPaidMock).toHaveBeenCalledWith(
      {
        orderId: "order-db-1",
        userId: "user-1",
        mercadoPagoPaymentId: "pay-1",
      },
      {},
    );
    expect(result).toEqual({
      success: true,
      status: 200,
      message: "Orden finalizada correctamente.",
      data: {
        orderId: "order-db-1",
        userId: "user-1",
        mercadoPagoPaymentId: "pay-1",
      },
    });
  });

  it("does not finalize when the payment amount does not match the order", async () => {
    findOrderByExternalReferenceForFulfillmentMock.mockResolvedValue({
      id: "order-db-1",
      buyerEmail: "buyer@example.com",
      userId: null,
      externalReference: "order_1",
      mercadoPagoPaymentId: null,
      status: OrderStatus.PENDING,
      total: new Prisma.Decimal(100),
      items: [
        {
          id: "item-1",
          productId: "course-1",
          type: ProductType.COURSE,
          title: "Curso 1",
          quantity: 1,
        },
      ],
    });

    const result = await finalizePaidOrder({
      mercadoPagoPaymentId: "pay-1",
      externalReference: "order_1",
      paymentStatus: "approved",
      currencyId: "ARS",
      paidAmount: 90,
      payerEmail: "buyer@example.com",
    });

    expect(result).toEqual({
      success: false,
      status: 400,
      message: "El monto pagado no coincide con la orden.",
    });
    expect(transactionMock).not.toHaveBeenCalled();
  });
});
