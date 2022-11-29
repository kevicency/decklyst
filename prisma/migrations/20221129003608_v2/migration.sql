-- CreateEnum
CREATE TYPE "Privacy" AS ENUM ('private', 'unlisted', 'public');

-- CreateEnum
CREATE TYPE "Archetype" AS ENUM ('aggro', 'midrange', 'control', 'combo');

-- CreateTable
CREATE TABLE "deck" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sharecode" TEXT NOT NULL,
    "deckcode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "cardcode" TEXT NOT NULL,
    "privacy" "Privacy" NOT NULL DEFAULT 'unlisted',
    "version" INTEGER NOT NULL DEFAULT 1,
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "archetype" "Archetype",
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT,
    "statsId" INTEGER NOT NULL,

    CONSTRAINT "deck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deckhistory" (
    "deckId" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "deckcode" TEXT NOT NULL,

    CONSTRAINT "deckhistory_pkey" PRIMARY KEY ("deckId","version")
);

-- CreateTable
CREATE TABLE "deckview" (
    "id" SERIAL NOT NULL,
    "sharecode" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL DEFAULT '',
    "userId" TEXT NOT NULL DEFAULT '',
    "views" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deckview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deckstats" (
    "id" SERIAL NOT NULL,
    "faction" TEXT NOT NULL DEFAULT 'neutral',
    "minionCount" INTEGER NOT NULL DEFAULT 0,
    "spellCount" INTEGER NOT NULL DEFAULT 0,
    "artifactCount" INTEGER NOT NULL DEFAULT 0,
    "totalCount" INTEGER NOT NULL DEFAULT 0,
    "spiritCost" INTEGER NOT NULL DEFAULT 0,
    "cardCounts" JSONB NOT NULL,

    CONSTRAINT "deckstats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deckImage" (
    "sharecode" TEXT NOT NULL,
    "deckcode" TEXT NOT NULL,
    "version" TEXT,
    "bytes" BYTEA,
    "renderStartedAt" TIMESTAMP(3),
    "renderedAt" TIMESTAMP(3),

    CONSTRAINT "deckImage_pkey" PRIMARY KEY ("sharecode")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "deck_sharecode_key" ON "deck"("sharecode");

-- CreateIndex
CREATE UNIQUE INDEX "deck_statsId_key" ON "deck"("statsId");

-- CreateIndex
CREATE INDEX "deck_deckcode" ON "deck"("deckcode");

-- CreateIndex
CREATE UNIQUE INDEX "deckview_sharecode_ipAddress_userId_key" ON "deckview"("sharecode", "ipAddress", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "deck" ADD CONSTRAINT "deck_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deck" ADD CONSTRAINT "deck_statsId_fkey" FOREIGN KEY ("statsId") REFERENCES "deckstats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deckhistory" ADD CONSTRAINT "deckhistory_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deckview" ADD CONSTRAINT "deckview_sharecode_fkey" FOREIGN KEY ("sharecode") REFERENCES "deck"("sharecode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deckview" ADD CONSTRAINT "deckview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deckImage" ADD CONSTRAINT "deckImage_sharecode_fkey" FOREIGN KEY ("sharecode") REFERENCES "deck"("sharecode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
