import { siteUrl } from '@/common/urls'
import { QRCodeCanvas } from 'qrcode.react'
import { useEffect, useState } from 'react'
import { useDeck } from './useDeck'

export const DeckQRCode = () => {
  const { deckcode, shortid } = useDeck()
  const [qrValue, setQrValue] = useState('')
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setQrValue(`${siteUrl}/${shortid ?? deckcode}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div key={qrValue}>
      <QRCodeCanvas
        className="rotate-90"
        key={qrValue}
        size={110}
        value={qrValue}
        bgColor="#0f172a"
        fgColor="#475569"
      />
    </div>
  )
}
