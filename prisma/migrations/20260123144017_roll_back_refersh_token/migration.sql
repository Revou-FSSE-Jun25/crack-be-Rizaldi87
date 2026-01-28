/*
  Warnings:

  - The primary key for the `RefreshToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `RefreshToken` table. All the data in the column will be lost.
  - The `id` column on the `RefreshToken` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[token]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropIndex
DROP INDEX "RefreshToken_userId_idx";

-- AlterTable
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");
