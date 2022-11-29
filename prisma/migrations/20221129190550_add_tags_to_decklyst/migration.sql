-- AlterTable
ALTER TABLE "deck" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
