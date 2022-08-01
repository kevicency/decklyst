-- CreateTable
CREATE TABLE "deck" (
    "id" SERIAL NOT NULL,
    "deckcode" TEXT NOT NULL,
    "image" BYTEA,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "deck_deckcode_key" ON "deck"("deckcode");
