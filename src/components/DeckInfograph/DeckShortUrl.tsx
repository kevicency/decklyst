import { useDeck } from '@/components/DeckInfograph/useDeck'

export const DeckShortUrl = () => {
  const { shortid, faction } = useDeck()

  return shortid ? (
    <div className="flex text-slate-500 items-center text-lg">
      <span>duelyst-share.vercel.app/</span>
      <span className={`text-${faction} font-bold font-mono text-2xl`}>{shortid}</span>
    </div>
  ) : null
}
