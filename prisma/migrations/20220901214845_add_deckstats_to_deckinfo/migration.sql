-- AlterTable
ALTER TABLE "deckinfo" ADD COLUMN     "artifactCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "faction" TEXT NOT NULL DEFAULT 'neutral',
ADD COLUMN     "minionCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "spellCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalCount" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "deckviews" ADD CONSTRAINT "deckviews_deckcode_fkey" FOREIGN KEY ("deckcode") REFERENCES "deckinfo"("deckcode") ON DELETE RESTRICT ON UPDATE CASCADE;
