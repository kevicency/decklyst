/*
  Warnings:

  - A unique constraint covering the columns `[tournamentId,deckId,playerName]` on the table `TournamentResult` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TournamentResult_tournamentId_deckId_playerName_key" ON "TournamentResult"("tournamentId", "deckId", "playerName");
