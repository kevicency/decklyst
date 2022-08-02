import { useDeck } from '@/components/DeckInfograph/useDeck'

export const DeckShortUrl = () => {
  const { shortid, faction } = useDeck()

  return shortid ? (
    <div className="flex text-slate-500 items-end">
      <span>duelyst-share.vercel.app/</span>
      <span className={`text-${faction} text-lg font-mono`}>{shortid}</span>
    </div>
  ) : null
}
