import { siteUrl } from '@/common/urls'
import { useDeck } from '@/components/DeckInfograph/useDeck'

export const DeckShortUrl = () => {
  const { shortid, faction } = useDeck()

  return shortid ? (
    <div className="flex text-slate-500 items-end">
      <span>{siteUrl.replace(/https?:\/\//, '')}/</span>
      <span className={`text-${faction} text-xl font-mono`}>{shortid}</span>
    </div>
  ) : null
}
