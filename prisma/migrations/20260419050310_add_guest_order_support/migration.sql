-- AlterTable
ALTER TABLE "Order"
ADD COLUMN "buyerEmail" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- Backfill existing orders from the related user when present.
UPDATE "Order" o
SET "buyerEmail" = u."email"
FROM "User" u
WHERE o."userId" = u."id"
  AND o."buyerEmail" IS NULL;

ALTER TABLE "Order"
ALTER COLUMN "buyerEmail" SET NOT NULL;
