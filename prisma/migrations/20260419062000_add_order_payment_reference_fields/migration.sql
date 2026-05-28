BEGIN;

ALTER TABLE "Order"
ADD COLUMN "externalReference" TEXT,
ADD COLUMN "mercadoPagoPreferenceId" TEXT,
ADD COLUMN "mercadoPagoPaymentId" TEXT;

UPDATE "Order"
SET "externalReference" = 'order_' || "id"
WHERE "externalReference" IS NULL;

ALTER TABLE "Order"
ALTER COLUMN "externalReference" SET NOT NULL;

ALTER TABLE "Order"
ADD CONSTRAINT "Order_externalReference_key" UNIQUE ("externalReference");

COMMIT;