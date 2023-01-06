-- CreateTable
CREATE TABLE "deckvote" (
    "id" SERIAL NOT NULL,
    "sharecode" TEXT NOT NULL,
    "userId" TEXT NOT NULL DEFAULT '',
    "vote" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deckvote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "deckvote_sharecode_userId_key" ON "deckvote"("sharecode", "userId");

-- AddForeignKey
ALTER TABLE "deckvote" ADD CONSTRAINT "deckvote_sharecode_fkey" FOREIGN KEY ("sharecode") REFERENCES "deck"("sharecode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deckvote" ADD CONSTRAINT "deckvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
