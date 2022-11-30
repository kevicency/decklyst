import { formatDistance } from 'date-fns'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

export const TimeAgo: FC<{ date: Date }> = ({ date }) => {
  const [timeAgo, setTimeAgo] = useState('')

  useEffect(() => {
    const update = () => setTimeAgo(formatDistance(date, new Date(), { addSuffix: true }))
    update()
    const intervalId = window.setInterval(() => {
      update()
    }, 5000)
    return () => window.clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <>{timeAgo}</>
}
