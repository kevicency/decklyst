/*
  Warnings:

  - You are about to drop the column `imageRendering` on the `deck` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "deck" DROP COLUMN "imageRendering",
ADD COLUMN     "imageRenderStart" BIGINT NOT NULL DEFAULT 0;
