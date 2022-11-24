import { useDeck } from '@/context/useDeck'

export const DeckCraftingCost = () => {
  const { faction, spiritCost } = useDeck()

  return (
    <div className="w-full text-lg">
      <span className={`text-${faction} font-semibold`}>{spiritCost}</span> Spirit
    </div>
  )
}
