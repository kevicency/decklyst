import type { CardData, CardSet, CardType, Rarity, SpriteResource } from '@/data/cards'
import fs from 'fs'
import fetch from 'node-fetch'
import path from 'path'
import { scrapedCardsById } from './generateCardsJson/scrapedCards'

const blacklist = [20452]

export interface CardJSON {
  name: string
  id: number
  cardSet: CardSet
  faction: number
  tribes: string[]
  rarity: Rarity
  relatedCards: number[]
  resource: SpriteResource
  mana: number
  attack?: number
  health?: number
  cardType: CardType
  description?: string
}

async function main() {
  const json = await fetch('https://api-phppdmqb3q-uc.a.run.app/cards.json').then(
    (response) => response.json() as Promise<CardJSON[]>,
  )
  const cards: CardData[] = json
    .filter(({ id }) => !blacklist.includes(id))
    .map((cardJson) => ({
      ...cardJson,
      description: cardJson.description ?? '',
      spriteName: scrapedCardsById[cardJson.id]?.spriteName,
      faction: scrapedCardsById[cardJson.id]?.faction ?? 'neutral',
      factionId: cardJson.faction,
    }))

  const jsonFilePath = path.join(__dirname, '../src/data/cards.json')

  fs.writeFileSync(jsonFilePath, JSON.stringify(cards))

  console.log(`Wrote ${cards.length} cards to ${jsonFilePath}`)
}

main().catch(console.error)
