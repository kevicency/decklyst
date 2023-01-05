import {
  artifactCount$,
  createDeck,
  faction$,
  minionCount$,
  spellCount$,
  spiritCost$,
  totalCount$,
} from '@/data/deck'
import { PrismaClient } from '@prisma/client'
import { parse } from 'csv-parse'
import * as dotenv from 'dotenv'
import fs from 'fs'
import minimist from 'minimist'
import path from 'path'

const [env, envLocal, envProd] = ['', '.local', '.production'].map((env) =>
  path.join(__dirname, '..', `.env${env}`),
)

dotenv.config({ path: env })

const loadTournamentResults = async (filePath?: string) => {
  if (!filePath) {
    throw new Error('Tourament file not specified')
  }

  if (!path.isAbsolute(filePath)) {
    filePath = path.join(__dirname, '..', filePath)
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`File ${filePath} does not exist`)
  }

  const parser = fs.createReadStream(filePath, { encoding: 'utf8' }).pipe(parse())

  const tournamentResults = []
  const counts: Record<string, number> = {}
  for await (const record of parser) {
    const [username, deckcode, _slug, place] = record.map((value: string) => value.trim())

    counts[username] = (counts[username] ?? 0) + 1

    tournamentResults.push({
      playerName: username,
      deckcode,
      place,
      deckId: '',
      count: counts[username],
      playerId: undefined as string | undefined,
    })
  }

  console.log(`Loaded ${tournamentResults.length} tournament results from ${filePath}`)

  return tournamentResults
}

const main = async () => {
  var args = minimist(process.argv.slice(2), {
    string: ['file', 'name', 'date', 'format'],
    boolean: ['production'],
    alias: { f: 'file', n: 'name', d: 'date', m: 'format', p: 'production' },
    default: { format: 'swiss' },
  })

  dotenv.config({ path: args.production ? envProd : envLocal, override: true })

  const slug = args.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
  const tournamentResults = await loadTournamentResults(args.file)

  const prisma = new PrismaClient()
  const tournamentBot = await prisma.user.upsert({
    where: { email: 'tournament-bot@decklyst.com' },
    create: {
      email: 'tournament-bot@decklyst.com',
      name: 'Tournament Bot',
    },
    update: {},
  })
  const tournament = await prisma.tournament.upsert({
    where: { slug },
    create: {
      name: args.name,
      slug,
      date: new Date(Date.parse(args.date)),
      format: args.format,
    },
    update: { results: { deleteMany: {} } },
  })

  for (const result of tournamentResults) {
    const player = await prisma.user.findFirst({
      where: { name: result.playerName },
    })

    let title = `${tournament.name} - ${result.playerName}`
    let sharecode = `${tournament.slug}_${result.playerName}`

    if (tournamentResults.filter((r) => r.playerName === result.playerName).length > 1) {
      sharecode += `_${result.count}`
      title += ` ${result.count}`
    }

    let decklyst = await prisma.decklyst.findFirst({
      where: { sharecode },
    })

    if (!decklyst) {
      const deck = createDeck(result.deckcode)
      const stats = {
        faction: faction$(deck),
        minionCount: minionCount$(deck),
        spellCount: spellCount$(deck),
        artifactCount: artifactCount$(deck),
        totalCount: totalCount$(deck),
        spiritCost: spiritCost$(deck),
        cardCounts: Object.fromEntries(deck.cards.map((card) => [card.id, card.count])),
      }

      decklyst = await prisma.decklyst.create({
        data: {
          sharecode,
          title,
          deckcode: result.deckcode,
          deckcodeNormalized: result.deckcode,
          author: { connect: { id: tournamentBot.id } },
          draft: false,
          stats: { create: stats },
          privacy: 'unlisted',
          tags: { set: ['tournament', tournament.name] },
        },
      })
    }
    await prisma.tournamentResult.create({
      data: {
        playerName: result.playerName,
        place: +result.place,
        deck: { connect: { id: decklyst.id } },
        tournament: { connect: { id: tournament.id } },
        player: player ? { connect: { id: player.id } } : undefined,
      },
    })
  }

  console.log(
    `Imported tournament ${tournament.name} (${slug}) with ${tournamentResults.length} results`,
  )
}

main().catch(console.error)
