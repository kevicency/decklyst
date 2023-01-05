import { cardsById } from '@/data/cards'
import { PrismaClient } from '@prisma/client'
import { stringify } from 'csv-stringify'
import * as dotenv from 'dotenv'
import fs from 'fs'
import minimist from 'minimist'
import path from 'path'

const [env, envLocal, envProd] = ['', '.local', '.production'].map((env) =>
  path.join(__dirname, '..', `.env${env}`),
)

dotenv.config({ path: env })

const main = async () => {
  var args = minimist(process.argv.slice(2), {
    string: ['out', 'slug'],
    alias: { o: 'out', s: 'slug' },
    default: { o: './scripts/tournaments/exports/' },
  })

  dotenv.config({ path: args.production ? envProd : envLocal, override: true })

  const slug = args.slug.toLowerCase().replace(/[^a-z0-9]/g, '-')
  let outFile = path.join(args.out, `${slug}.csv`)
  if (!path.isAbsolute(outFile)) {
    outFile = path.join(__dirname, '..', outFile)
  }

  const prisma = new PrismaClient()

  const tournament = await prisma.tournament.findFirst({
    where: { slug },
    include: { results: { include: { deck: { include: { stats: true } } } } },
  })

  if (!tournament) {
    console.error(`Tournament ${slug} not found`)
    return
  }

  const header = [
    'Tournament',
    'Place',
    'Player',
    'Count',
    'Id',
    'Card',
    'Faction',
    'Type',
    'Rarity',
    'Mana',
    'Deckcode',
  ]
  const data = tournament.results
    .slice(1)
    .sort((a, b) => a.place - b.place)
    .flatMap((result) => {
      const shared = [tournament.slug, result.place, result.playerName]

      const cards = Object.entries(result.deck.stats.cardCounts as Record<string, number>).map(
        ([id, count]) => {
          const card = cardsById[+id]
          if (!card) {
            throw new Error(`Card ${id} not found`)
          }

          return [count, id, card.name, card.faction, card.cardType, card.rarity, card.mana]
        },
      )

      return cards.map((card) => [...shared, ...card, result.deck.deckcode])
    })

  const csv = await new Promise<string>((resolve, reject) => {
    stringify([header, ...data], (err, output) => {
      if (err) {
        reject(err)
      } else {
        resolve(output)
      }
    })
  })

  await fs.promises.writeFile(outFile, csv)

  console.log(
    `Exported tournament ${tournament.name} (${slug}) to ${outFile} (${data.length} rows)`,
  )
}

main().catch(console.error)
