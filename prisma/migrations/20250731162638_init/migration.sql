/*
  Warnings:

  - You are about to drop the column `ClerkUserId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerkUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `demandLevel` on the `IndustryInsight` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `marketOutlook` on the `IndustryInsight` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `clerkUserId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."User_ClerkUserId_key";

-- AlterTable
ALTER TABLE "public"."IndustryInsight" DROP COLUMN "demandLevel",
ADD COLUMN     "demandLevel" TEXT NOT NULL,
DROP COLUMN "marketOutlook",
ADD COLUMN     "marketOutlook" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "ClerkUserId",
ADD COLUMN     "clerkUserId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."DemandLevel";

-- DropEnum
DROP TYPE "public"."MarketOutLook";

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "public"."User"("clerkUserId");
