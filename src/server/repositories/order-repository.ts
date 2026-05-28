import { OrderStatus, Prisma, ProductType } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

type CreateOrderWithItemInput = {
  buyerEmail: string;
  externalReference: string;
  total: Prisma.Decimal;
  item: {
    productId: string;
    title: string;
    price: Prisma.Decimal;
  };
};

type MarkOrderPaidInput = {
  orderId: string;
  userId: string;
  mercadoPagoPaymentId: string;
};

function getDb(db?: Prisma.TransactionClient) {
  return db ?? prisma;
}

export async function createOrderWithItem(input: CreateOrderWithItemInput) {
  return getDb().order.create({
    data: {
      buyerEmail: input.buyerEmail,
      externalReference: input.externalReference,
      total: input.total,
      items: {
        create: {
          productId: input.item.productId,
          type: ProductType.COURSE,
          title: input.item.title,
          price: input.item.price,
          quantity: 1,
        },
      },
    },
    select: {
      id: true,
      buyerEmail: true,
      externalReference: true,
      total: true,
      items: {
        select: {
          id: true,
          productId: true,
          title: true,
          price: true,
          quantity: true,
        },
      },
    },
  });
}

export async function updateOrderMercadoPagoPreferenceId(
  id: string,
  mercadoPagoPreferenceId: string,
) {
  return getDb().order.update({
    where: {
      id,
    },
    data: {
      mercadoPagoPreferenceId,
    },
    select: {
      id: true,
      mercadoPagoPreferenceId: true,
    },
  });
}

export async function findOrderByExternalReferenceForFulfillment(
  externalReference: string,
  db?: Prisma.TransactionClient,
) {
  return getDb(db).order.findUnique({
    where: {
      externalReference,
    },
    select: {
      id: true,
      buyerEmail: true,
      userId: true,
      externalReference: true,
      mercadoPagoPaymentId: true,
      status: true,
      total: true,
      items: {
        select: {
          id: true,
          productId: true,
          type: true,
          title: true,
          quantity: true,
        },
      },
    },
  });
}

export async function markOrderPaid(
  input: MarkOrderPaidInput,
  db?: Prisma.TransactionClient,
) {
  return getDb(db).order.update({
    where: {
      id: input.orderId,
    },
    data: {
      userId: input.userId,
      mercadoPagoPaymentId: input.mercadoPagoPaymentId,
      status: OrderStatus.PAID,
    },
    select: {
      id: true,
      userId: true,
      mercadoPagoPaymentId: true,
      status: true,
    },
  });
}
