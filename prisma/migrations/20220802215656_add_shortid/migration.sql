/*
  Warnings:

  - A unique constraint covering the columns `[shortid]` on the table `deck` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shortid` to the `deck` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "deck" ADD COLUMN     "shortid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "deck_shortid_key" ON "deck"("shortid");
