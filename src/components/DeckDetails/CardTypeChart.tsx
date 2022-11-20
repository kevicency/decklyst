import { colors, lighten } from '@/common/colors'
import { useDeck } from '@/context/useDeck'
import type { CardType } from '@/data/cards'
import { chain, sumBy } from 'lodash'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts'
import { gray } from 'tailwindcss/colors'

const order: CardType[] = ['Minion', 'Spell', 'Artifact']
export const CardTypeChart = () => {
  const { cards, faction } = useDeck()
  const data = chain(cards)
    .groupBy((card) => card.cardType)
    .map((cards, cardType) => ({
      name: cardType as CardType,
      value: sumBy(cards, (card) => card.count),
    }))
    .map((x) => ({ ...x, label: ` ${x.name[0]}: ${x.value} ` }))
    .filter(({ name }) => name !== 'General')
    .sortBy(({ name }) => order.indexOf(name))
    .value()

  return (
    <ResponsiveContainer width="100%" height={180}>
      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid stroke={gray[700]} />
        <PolarAngleAxis dataKey="name" stroke={gray[400]} axisLineType="circle" tickLine={false} />
        <Radar
          dataKey="value"
          stroke={lighten(colors[faction], -20)}
          fill={colors[faction]}
          fillOpacity={0.6}
          // label={{ position: 'insideBottom', offset: 5, fill: gray[300], rotate: 0 }}
        ></Radar>
      </RadarChart>
    </ResponsiveContainer>
  )
}
