import { siteUrl } from '@/common/urls'
import { useDeck } from '@/components/DeckInfograph/useDeck'

export const DeckShortUrl = () => {
  const { shortid, faction } = useDeck()
  const hostname = siteUrl.replace(/^https?:\/\//, '')

  return shortid ? (
    <div className="flex text-slate-500 items-center text-lg">
      <span>{hostname}/</span>
      <span
        className={`text-${faction} font-bold font-mono text-2xl ml-1 mt-[-2px] `}
        style={{ letterSpacing: '1.5px' }}
      >
        {shortid}
      </span>
    </div>
  ) : null
}
