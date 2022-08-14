-- CreateTable
CREATE TABLE "deckinfo" (
    "id" SERIAL NOT NULL,
    "sharecode" TEXT NOT NULL,
    "deckcode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deckinfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deckimage" (
    "id" SERIAL NOT NULL,
    "deckcode" TEXT NOT NULL,
    "version" TEXT,
    "bytes" BYTEA,
    "renderedAt" TIMESTAMP(3),

    CONSTRAINT "deckimage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "deckinfo_sharecode_key" ON "deckinfo"("sharecode");

-- CreateIndex
CREATE UNIQUE INDEX "deckinfo_deckcode_key" ON "deckinfo"("deckcode");

-- CreateIndex
CREATE UNIQUE INDEX "deckimage_deckcode_key" ON "deckimage"("deckcode");

-- AddForeignKey
ALTER TABLE "deckinfo" ADD CONSTRAINT "deckinfo_deckcode_fkey" FOREIGN KEY ("deckcode") REFERENCES "deckimage"("deckcode") ON DELETE RESTRICT ON UPDATE CASCADE;
