-- CreateTable
CREATE TABLE "deckviews" (
    "deckcode" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deckviews_pkey" PRIMARY KEY ("deckcode","ipAddress")
);
