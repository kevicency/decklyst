import { colors, lighten } from '@/common/colors'
import { useDeck } from '@/context/useDeck'
import type { Rarity } from '@/data/cards'
import { chain, sumBy } from 'lodash'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { gray } from 'tailwindcss/colors'

export const rarities: Rarity[] = ['basic', 'common', 'rare', 'epic', 'legendary']
export const CardRarityChart = () => {
  const { cards } = useDeck()
  const grouped = chain(cards)
    .filter((card) => card.cardType !== 'General')
    .groupBy((card) => card.rarity)
    .value()

  const data = rarities
    .map((rarity) => ({
      name: rarity,
      value: sumBy(grouped[rarity], (card) => card.count) || 0,
    }))
    .filter(({ value }) => value > 0)

  const label = ({ cx, cy, midAngle, innerRadius, outerRadius, value, index }: any) => {
    const RADIAN = Math.PI / 180
    const radius = 25 + innerRadius + (outerRadius - innerRadius)
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    const rarity = data[index].name

    return (
      <text
        x={x}
        y={y}
        fill={colors[rarity]}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        <tspan fill={gray[300]}>{value}</tspan> {data[index].name}
      </text>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie
          cx="50%"
          cy="50%"
          outerRadius="70%"
          innerRadius="33%"
          data={data}
          dataKey="value"
          nameKey="name"
          stroke={gray[700]}
          label={label}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${entry}`} fill={lighten(colors[entry.name], -10)} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
