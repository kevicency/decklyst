import type { NextApiRequest } from 'next'
import type { GetServerSidePropsContext } from 'next/types'

export const getIpAddress = (req: NextApiRequest | GetServerSidePropsContext['req']) => {
  const forwarded = req.headers['x-forwarded-for'] as string
  const real = req.headers['x-real-ip'] as string
  const forwardedIp = forwarded ? forwarded.split(',')[0] : null
  const realIp = real ? real : null
  return forwardedIp ?? realIp ?? req.socket.remoteAddress ?? 'unknown'
}
