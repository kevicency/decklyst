import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

const deckinfoFile = path.join(__dirname, '.data', 'deckinfo.json')
const deckviewsFile = path.join(__dirname, '.data', 'deckviews.json')

const main = async () => {
  const cmd = process.argv[2] ?? 'export'

  if (cmd === 'export') {
    const deckinfos = await prisma.deckinfo.findMany()
    fs.writeFileSync(deckinfoFile, JSON.stringify(deckinfos, null, 2))
    console.log(`Exported ${deckinfos.length} deckinfos to ${deckinfoFile}`)

    const deckviews = await prisma.deckviews.findMany()
    fs.writeFileSync(deckviewsFile, JSON.stringify(deckviews, null, 2))
    console.log(`Exported ${deckviews.length} deckviews to ${deckviewsFile}`)
  } else if (cmd === 'import') {
    const deckinfos = JSON.parse(fs.readFileSync(deckinfoFile, 'utf8'))
    await prisma.deckinfo.createMany({
      data: deckinfos,
      skipDuplicates: true,
    })
    console.log(`Imported ${deckinfos.length} deckinfos from ${deckinfoFile}`)

    const deckviews = JSON.parse(fs.readFileSync(deckviewsFile, 'utf8'))
    await prisma.deckviews.createMany({
      data: deckviews,
      skipDuplicates: true,
    })
    console.log(`Imported ${deckviews.length} deckviews from ${deckviewsFile}`)
  }
}

main().catch(console.error)
