import type { CardData, CardSet, CardType, Faction, Rarity, SpriteResource } from '@/data/cards'
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

const getFaction = (factionId: number): Faction => {
  switch (factionId) {
    case 1:
      return 'lyonar'
    case 2:
      return 'songhai'
    case 3:
      return 'vetruvian'
    case 4:
      return 'abyssian'
    case 5:
      return 'magmar'
    case 6:
      return 'vanar'
    case 100:
      return 'neutral'
  }
  return 'neutral'
}

const getSpriteName = (cardJson: CardJSON) => {
  const spriteName = scrapedCardsById[cardJson.id]?.spriteName

  if (!spriteName) {
    console.log(`Unknown sprite name for ${cardJson.id} - ${cardJson.name}`)
  }
  return spriteName
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
      spriteName: getSpriteName(cardJson),
      faction: getFaction(cardJson.faction),
      factionId: cardJson.faction,
      rarity: cardJson.rarity.toLowerCase() as Rarity,
    }))

  const jsonFilePath = path.join(__dirname, '../src/data/carddata.json')

  fs.writeFileSync(jsonFilePath, JSON.stringify(cards))

  console.log(`Wrote ${cards.length} cards to ${jsonFilePath}`)
}

main().catch(console.error)
