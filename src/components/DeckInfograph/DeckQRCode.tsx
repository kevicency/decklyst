import { siteUrl } from '@/common/urls'
import { useDeck } from '@/context/useDeck'
import { QRCodeCanvas } from 'qrcode.react'
import { useEffect, useState } from 'react'
import colors from 'tailwindcss/colors'

export const DeckQRCode = () => {
  const { deckcode, meta } = useDeck()
  const [qrValue, setQrValue] = useState('')
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setQrValue(`${siteUrl}/${meta?.sharecode ?? deckcode}`)
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
        bgColor={colors.slate['900']}
        fgColor={colors.slate['700']}
      />
    </div>
  )
}
