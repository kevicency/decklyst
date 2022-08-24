import { siteUrl } from '@/common/urls'
import { useDeck } from '@/context/useDeck'

export const DeckShareUrl = () => {
  const { meta, faction } = useDeck()
  const hostname = siteUrl.replace(/^https?:\/\//, '')

  return meta?.sharecode ? (
    <div className="flex text-slate-500 items-center text-lg">
      <span>{hostname}/</span>
      <span className={`text-${faction} font-bold font-mono text-2xl ml-1 mt-[-2px] `}>
        {meta?.sharecode}
      </span>
    </div>
  ) : null
}
