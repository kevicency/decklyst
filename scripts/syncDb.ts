import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { createDeck, deckcodeNormalized$ } from '../src/data/deck'

const prisma = new PrismaClient()

const usersFile = path.join(__dirname, '.data', 'users.json')
const decklystFile = path.join(__dirname, '.data', 'decklysts.json')
const deckviewsFile = path.join(__dirname, '.data', 'deckviews.json')
const deckviewTotalsFile = path.join(__dirname, '.data', 'deckviewTotals.json')
const deckImageFile = path.join(__dirname, '.data', 'deckImage.json')

const main = async () => {
  const cmd = process.argv[2] ?? 'export'

  if (cmd === 'export') {
    const users = await prisma.user.findMany({})
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2))
    console.log(`Exported ${users.length} users to ${usersFile}`)

    const decklysts = await prisma.decklyst.findMany({ include: { stats: true } })
    fs.writeFileSync(decklystFile, JSON.stringify(decklysts, null, 2))
    console.log(`Exported ${decklysts.length} decklysts to ${decklystFile}`)

    // const deckviews = await prisma.deckView.findMany()
    // fs.writeFileSync(deckviewsFile, JSON.stringify(deckviews, null, 2))
    // console.log(`Exported ${deckviews.length} deckviews to ${deckviewsFile}`)

    // const deckviewTotals = Object.fromEntries(
    //   (
    //     await prisma.deckviews.groupBy({
    //       by: ['deckcode'],
    //       _count: {
    //         deckcode: true,
    //       },
    //     })
    //   ).map((group) => [group.deckcode, group._count.deckcode]),
    // )
    // fs.writeFileSync(deckviewTotalsFile, JSON.stringify(deckviewTotals, null, 2))
    // console.log(
    //   `Exported ${Object.keys(deckviewTotals).length} deckview totals to ${deckviewTotalsFile}`,
    // )

    // // const deckImages = await prisma.deckImage.findMany()
    // const deckImages = [] as any[]
    // const serializableDeckImages = deckImages.map((deckImage) => {
    //   deckImage.bytes = (deckImage.bytes ? deckImage.bytes.toString('base64') : null) as any
    //   return deckImage
    // })
    // fs.writeFileSync(deckImageFile, JSON.stringify(serializableDeckImages, null, 2))
    // console.log(`Exported ${deckImages.length} deckImages to ${deckImageFile}`)
  } else if (cmd === 'import') {
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'))
    await prisma.user.createMany({
      data: users,
      skipDuplicates: true,
    })
    console.log(`Imported ${users.length} users from ${usersFile}`)

    const decklysts: any[] = JSON.parse(fs.readFileSync(decklystFile, 'utf8'))
    await prisma.deckStats.createMany({
      data: decklysts.map(({ stats, ...decklyst }) => stats),
      skipDuplicates: true,
    })
    await prisma.decklyst.createMany({
      data: decklysts.map(({ stats, ...decklyst }) => decklyst),
      skipDuplicates: true,
    })
    console.log(`Imported ${decklysts.length} decklysts from ${decklystFile}`)

    // const deckinfos = JSON.parse(fs.readFileSync(decklystFile, 'utf8')) as {
    //   deckcode: string
    //   sharecode: string
    //   createdAt: Date
    // }[]
    // const deckviewTotals = JSON.parse(fs.readFileSync(deckviewTotalsFile, 'utf8')) as Record<
    //   string,
    //   number
    // >

    // for (const deckinfo of deckinfos) {
    //   const deckcode = deckinfo.deckcode
    //   const deck = createDeck(deckcode)
    //   // const [title = '', cardcode] = splitDeckcode(deckcode)
    //   const title = title$(deck)
    //   const deckcodeNormalized = deckcodeNormalized$(deck)

    //   if (!title || totalCount$(deck) !== 40) continue

    //   await prisma.decklyst
    //     .create({
    //       data: {
    //         deckcode,
    //         deckcodeNormalized,
    //         title,
    //         draft: totalCount$(deck) !== 40,
    //         views: deckviewTotals[deckcode] ?? 0,
    //         sharecode: deckinfo.sharecode,
    //         privacy: 'public',
    //         stats: {
    //           create: {
    //             faction: faction$(deck),
    //             minionCount: minionCount$(deck),
    //             spellCount: spellCount$(deck),
    //             artifactCount: artifactCount$(deck),
    //             totalCount: totalCount$(deck),
    //             spiritCost: spiritCost$(deck),
    //             cardCounts: Object.fromEntries(deck.cards.map((card) => [card.id, card.count])),
    //           },
    //         },
    //         createdAt: deckinfo.createdAt,
    //         updatedAt: deckinfo.createdAt,
    //       },
    //       select: { id: true },
    //     })
    //     .catch(console.error)
    // }
    // console.log(`Imported ${deckinfos.length} decklysts from ${decklystFile}`)

    // const deckviews = JSON.parse(fs.readFileSync(deckviewsFile, 'utf8'))
    // await prisma.deckviews.createMany({
    //   data: deckviews,
    //   skipDuplicates: true,
    // })
    // console.log(`Imported ${deckviews.length} deckviews from ${deckviewsFile}`)

    // const deckImages = JSON.parse(fs.readFileSync(deckImageFile, 'utf8')).map(
    //   ({ id, bytes, ...rest }: any) => ({
    //     ...rest,
    //     bytes: Buffer.from(bytes, 'base64'),
    //   }),
    // )
    // await prisma.deckImage.createMany({
    //   data: deckImages,
    //   skipDuplicates: true,
    // })
    // console.log(`Imported ${deckImages.length} deckviews from ${deckImageFile}`)
  } else if (cmd === 'update') {
    const decklysts = await prisma.decklyst.findMany({})
    for (const decklyst of decklysts) {
      const deck = createDeck(decklyst.deckcode)
      const deckcodeNormalized = deckcodeNormalized$(deck)
      await prisma.decklyst.update({
        where: { id: decklyst.id },
        data: { deckcodeNormalized },
      })
    }
    // await prisma.decklyst.updateMany({ data: { privacy: 'public' } })
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
