import { useDeck } from './useDeck'
import { useEffect, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

export const DeckQRCode = () => {
  const { deckcode } = useDeck()
  const [qrValue, setQrValue] = useState('')
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setQrValue(`${window.location.origin}/${deckcode}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div key={qrValue}>
      <QRCodeCanvas key={qrValue} size={110} value={qrValue} bgColor="#0f172a" fgColor="#475569" />
    </div>
  )
}
