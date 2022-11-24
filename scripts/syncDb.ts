import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { createDeck, spiritCost$ } from '../src/data/deck'

const prisma = new PrismaClient()

const deckinfoFile = path.join(__dirname, '.data', 'deckinfo.json')
const deckviewsFile = path.join(__dirname, '.data', 'deckviews.json')
const deckimageFile = path.join(__dirname, '.data', 'deckimage.json')

const main = async () => {
  const cmd = process.argv[2] ?? 'export'

  if (cmd === 'export') {
    const deckinfos = await prisma.deckinfo.findMany()
    fs.writeFileSync(deckinfoFile, JSON.stringify(deckinfos, null, 2))
    console.log(`Exported ${deckinfos.length} deckinfos to ${deckinfoFile}`)

    const deckviews = await prisma.deckviews.findMany()
    fs.writeFileSync(deckviewsFile, JSON.stringify(deckviews, null, 2))
    console.log(`Exported ${deckviews.length} deckviews to ${deckviewsFile}`)

    const deckimages = await prisma.deckimage.findMany()
    const serializableDeckimages = deckimages.map((deckimage) => {
      deckimage.bytes = (deckimage.bytes ? deckimage.bytes.toString('base64') : null) as any
      return deckimage
    })
    fs.writeFileSync(deckimageFile, JSON.stringify(serializableDeckimages, null, 2))
    console.log(`Exported ${deckimages.length} deckimages to ${deckimageFile}`)
  } else if (cmd === 'import') {
    const deckinfos = JSON.parse(fs.readFileSync(deckinfoFile, 'utf8'))
    await prisma.deckinfo.createMany({
      data: deckinfos.map(({ id, ...rest }: any) => rest),
      skipDuplicates: true,
    })
    console.log(`Imported ${deckinfos.length} deckinfos from ${deckinfoFile}`)

    const deckviews = JSON.parse(fs.readFileSync(deckviewsFile, 'utf8'))
    await prisma.deckviews.createMany({
      data: deckviews,
      skipDuplicates: true,
    })
    console.log(`Imported ${deckviews.length} deckviews from ${deckviewsFile}`)

    const deckimages = JSON.parse(fs.readFileSync(deckimageFile, 'utf8')).map(
      ({ id, bytes, ...rest }: any) => ({
        ...rest,
        bytes: Buffer.from(bytes, 'base64'),
      }),
    )
    await prisma.deckimage.createMany({
      data: deckimages,
      skipDuplicates: true,
    })
    console.log(`Imported ${deckimages.length} deckviews from ${deckimageFile}`)
  } else if (cmd === 'update') {
    const deckinfos = await prisma.deckinfo.findMany({ where: { spiritCost: 0 } })
    for (const deckinfo of deckinfos) {
      const spiritCost = spiritCost$(createDeck(deckinfo.deckcode))
      await prisma.deckinfo.update({ where: { deckcode: deckinfo.deckcode }, data: { spiritCost } })
    }
    console.log(`Updated ${deckinfos.length} deckinfos`)
  }
}

main().catch(console.error)
