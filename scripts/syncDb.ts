import { splitDeckcode } from '@/data/deckcode'
import type { Deckinfo } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import {
  artifactCount$,
  createDeck,
  faction$,
  minionCount$,
  spellCount$,
  spiritCost$,
  totalCount$,
} from '../src/data/deck'

const prisma = new PrismaClient()

const deckinfoFile = path.join(__dirname, '.data', 'deckinfo.json')
const deckviewsFile = path.join(__dirname, '.data', 'deckviews.json')
const deckviewTotalsFile = path.join(__dirname, '.data', 'deckviewTotals.json')
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

    const deckviewTotals = Object.fromEntries(
      (
        await prisma.deckviews.groupBy({
          by: ['deckcode'],
          _count: {
            deckcode: true,
          },
        })
      ).map((group) => [group.deckcode, group._count.deckcode]),
    )
    fs.writeFileSync(deckviewTotalsFile, JSON.stringify(deckviewTotals, null, 2))
    console.log(
      `Exported ${Object.keys(deckviewTotals).length} deckview totals to ${deckviewTotalsFile}`,
    )

    // const deckimages = await prisma.deckimage.findMany()
    const deckimages = [] as any[]
    const serializableDeckimages = deckimages.map((deckimage) => {
      deckimage.bytes = (deckimage.bytes ? deckimage.bytes.toString('base64') : null) as any
      return deckimage
    })
    fs.writeFileSync(deckimageFile, JSON.stringify(serializableDeckimages, null, 2))
    console.log(`Exported ${deckimages.length} deckimages to ${deckimageFile}`)
  } else if (cmd === 'import') {
    const deckinfos = JSON.parse(fs.readFileSync(deckinfoFile, 'utf8')) as Deckinfo[]
    const deckviewTotals = JSON.parse(fs.readFileSync(deckviewTotalsFile, 'utf8')) as Record<
      string,
      number
    >

    for (const deckinfo of deckinfos) {
      const deckcode = deckinfo.deckcode
      const deck = createDeck(deckcode)
      const [title = '', cardcode] = splitDeckcode(deckcode)

      await prisma.decklyst
        .create({
          data: {
            deckcode,
            title,
            cardcode,
            draft: totalCount$(deck) !== 40,
            views: deckviewTotals[deckcode] ?? 0,
            sharecode: deckinfo.sharecode,
            privacy: 'public',
            stats: {
              create: {
                faction: faction$(deck),
                minionCount: minionCount$(deck),
                spellCount: spellCount$(deck),
                artifactCount: artifactCount$(deck),
                totalCount: totalCount$(deck),
                spiritCost: spiritCost$(deck),
                cardCounts: Object.fromEntries(deck.cards.map((card) => [card.id, card.count])),
              },
            },
            createdAt: deckinfo.createdAt,
            updatedAt: deckinfo.createdAt,
          },
          select: { id: true },
        })
        .catch(console.error)
    }
    console.log(`Imported ${deckinfos.length} decklysts from ${deckinfoFile}`)

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
    // const deckinfos = await prisma.deckinfo.findMany({
    //   where: { OR: [{ spiritCost: 0 }, { deckcodeDecoded: '' }] },
    // })
    // for (const deckinfo of deckinfos) {
    //   const spiritCost = spiritCost$(createDeck(deckinfo.deckcode))
    //   const decoded = debase64(splitDeckcode(deckinfo.deckcode)[1]) + ','
    //   await prisma.deckinfo.update({
    //     where: { deckcode: deckinfo.deckcode },
    //     data: { spiritCost, deckcodeDecoded: decoded },
    //   })
    // }
    await prisma.decklyst.updateMany({ data: { privacy: 'public' } })
    // console.log(`Updated ${deckinfos.length} deckinfos`)
    // } else if (cmd === 'test') {
    //   const deckinfos = await prisma.deckinfo.findMany({
    //     where: {
    //       AND: [{ AND: [{ deckcodeDecoded: { contains: ':162,' } }] }],
    //     },
    //   })
    //   console.log('Found', deckinfos.length, 'decks')
  }
}

main().catch(console.error)
