const env = {
  vercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  vercelEnv: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV,
  remoteSnapshotUrl:
    process.env.NEXT_PUBLIC_REMOTE_SNAPSHOT_URL ||
    process.env.REMOTE_SNAPSHOT_URL ||
    'https://decklyst.azurewebsites.net',
}

export const siteUrl = env.vercelEnv === 'preview' ? `https://${env.vercelUrl}` : env.siteUrl

export const deckUrl = (code: string, relative = false) =>
  `${relative ? '' : siteUrl}/${encodeURIComponent(code)}`

export const snapshotUrl = (code: string, relative = false) =>
  `${deckUrl(code, relative)}?snapshot=1`

export const deckImageUrl = (deckcode: string, relative = false) =>
  `${deckUrl(deckcode, relative)}.png`

export const remoteSnapshotUrl = (deckcode: string) =>
  `${env.remoteSnapshotUrl}/api/snapshot?deckcode=${encodeURIComponent(deckcode)}`
