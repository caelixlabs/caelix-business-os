/*
  Warnings:

  - The primary key for the `Organization` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Organization` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(32)`.

*/
-- AlterTable
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(32),
ADD CONSTRAINT "Organization_pkey" PRIMARY KEY ("id");
