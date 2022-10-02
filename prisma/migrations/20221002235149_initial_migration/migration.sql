-- CreateTable
CREATE TABLE "deckinfo" (
    "deckcode" TEXT NOT NULL,
    "sharecode" TEXT NOT NULL,
    "faction" TEXT NOT NULL DEFAULT 'neutral',
    "minionCount" INTEGER NOT NULL DEFAULT 0,
    "spellCount" INTEGER NOT NULL DEFAULT 0,
    "artifactCount" INTEGER NOT NULL DEFAULT 0,
    "totalCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deckinfo_pkey" PRIMARY KEY ("deckcode")
);

-- CreateTable
CREATE TABLE "deckimage" (
    "deckcode" TEXT NOT NULL,
    "version" TEXT,
    "bytes" BYTEA,
    "renderStartedAt" TIMESTAMP(3),
    "renderedAt" TIMESTAMP(3),

    CONSTRAINT "deckimage_pkey" PRIMARY KEY ("deckcode")
);

-- CreateTable
CREATE TABLE "deckviews" (
    "deckcode" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deckviews_pkey" PRIMARY KEY ("deckcode","ipAddress")
);

-- CreateIndex
CREATE UNIQUE INDEX "deckinfo_sharecode_key" ON "deckinfo"("sharecode");

-- AddForeignKey
ALTER TABLE "deckviews" ADD CONSTRAINT "deckviews_deckcode_fkey" FOREIGN KEY ("deckcode") REFERENCES "deckinfo"("deckcode") ON DELETE RESTRICT ON UPDATE CASCADE;
