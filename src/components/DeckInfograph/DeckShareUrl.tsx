import { siteUrl } from '@/common/urls'
import { useDeck } from '@/context/useDeck'

export const DeckShareUrl = () => {
  const { meta, faction } = useDeck()
  const hostname = siteUrl.replace(/^https?:\/\//, '')

  return meta?.sharecode ? (
    <div className="flex items-center text-lg text-gray-500">
      <span>{hostname}/</span>
      <span className={`text-${faction} ml-1 mt-[-2px] font-mono text-2xl font-bold `}>
        {meta?.sharecode}
      </span>
    </div>
  ) : null
}
