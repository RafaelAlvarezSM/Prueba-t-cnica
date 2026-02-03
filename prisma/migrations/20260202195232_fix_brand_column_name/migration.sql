/*
  Warnings:

  - You are about to drop the column `brand` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `products` table. All the data in the column will be lost.
  - Added the required column `brandName` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_options" ADD COLUMN     "minStock" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "brand",
DROP COLUMN "gender",
ADD COLUMN     "brandName" TEXT NOT NULL;
