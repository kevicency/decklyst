import { maxSpiritCost, minSpiritCost } from '@/data/deck'
import { useState } from 'react'
import { useThrottle } from '../../hooks/useThrottle'
import { NumberSliderInput } from '../NumberSliderInput'

export const SpiritSlider = ({
  value,
  onChange,
  throttle,
}: {
  value: number
  onChange: (value: number) => void
  throttle?: number
}) => {
  const [spirit, setSpirit] = useState(value)

  const onChangeThrottled = useThrottle((value: number) => {
    onChange(value)
  }, throttle ?? 1000)

  const handleChanged = (value: number) => {
    setSpirit(value)
    onChangeThrottled(value)
  }
  const handleInputChanged = (value: number) => {
    setSpirit(value)
    onChange(value)
  }
  return (
    <label className="items-center justify-center gap-x-4 font-medium text-gray-100">
      Max Spirit
      <div className="flex flex-row-reverse items-center gap-x-4">
        <input
          type="number"
          className="!focus:outline-none w-20 border-none bg-alt-800 py-1 px-1 text-center text-gray-100 accent-accent-600"
          value={spirit}
          onChange={(e) => handleInputChanged(parseInt(e.target.value))}
        />
        <NumberSliderInput
          min={minSpiritCost}
          max={maxSpiritCost}
          value={spirit ?? maxSpiritCost}
          onChange={setSpirit}
          onEnd={handleChanged}
        />
      </div>
    </label>
  )
}
