/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Vote` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Vote_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_id_key" ON "Vote"("id");
