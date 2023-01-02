import { PrismaClient } from '@prisma/client'
import { parse } from 'csv-parse/.'
import fs from 'fs'
import minimist from 'minimist'
import path from 'path'

const prisma = new PrismaClient()

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
  for await (const record of parser) {
    // Work with each record
    tournamentResults.push(record)
  }
  return tournamentResults
}

const main = async () => {
  var args = minimist(process.argv.slice(2), {
    string: ['file', 'name', 'date', 'format'],
    alias: { f: 'file', n: 'name', d: 'date', m: 'format' },
    default: { format: 'swiss' },
  })

  const slug = args.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
  const tournamentResults = await loadTournamentResults(args.file)

  const tournament = await prisma.tournament.upsert({
    where: { slug },
    create: {
      name: args.name,
      slug,
      date: new Date(Date.parse(args.date)),
      format: args.format,
    },
    update: {},
  })

  console.log(
    `Imported tournament ${tournament.name} (${slug}) with ${tournamentResults.length} results`,
  )
}
