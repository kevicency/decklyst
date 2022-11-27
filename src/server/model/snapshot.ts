import { env } from '@/env/server.mjs'
import { Buffer } from 'node:buffer'

export const snapshotUrl = (code: string, relative = false) =>
  `${relative ? '' : env.NEXT_PUBLIC_SITE_URL}/deckimage/${encodeURIComponent(
    code,
  )}?renderSecret=${encodeURIComponent(env.RENDER_SECRET)}`

export const remoteSnapshotUrl = (deckcode: string) =>
  `${
    env.REMOTE_SNAPSHOT_URL ?? 'https://duelyst-deck-renderer.azurewebsites.net'
  }/api/render?deckcode=${encodeURIComponent(deckcode)}`

export const snapshot = (code: string) =>
  env.VERCEL === '1' ? snapshotBrowserless(code) : snapshotLocal(code)

export const snapshotLocal = async (code: string) => {
  const puppeteer = require('puppeteer')

  const browser = await puppeteer.launch({
    args: ['--disable-setuid-sandbox', '--no-sandbox', '--no-zygote'],
    defaultViewport: { width: 1280, height: 1080 },
  })

  try {
    const url = snapshotUrl(code)
    const page = await browser.newPage()
    await page.emulateMediaType('screen')
    await page.goto(url, { waitUntil: 'networkidle0' })
    const content = await page.$('#snap')
    const image = (await content!.screenshot({ omitBackground: true })) as Buffer

    await browser.close()

    return image
  } catch (e) {
    console.error(e)
    await browser.close()
  }

  return null
}

export const snapshotBrowserless = async (code: string) => {
  try {
    const response = env.BROWSERLESS_API_TOKEN
      ? await fetch(`https://chrome.browserless.io/screenshot?token=${env.BROWSERLESS_API_TOKEN}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: snapshotUrl(code),
            options: {
              fullPage: false,
              type: 'png',
            },
            gotoOptions: {
              waitUntil: 'networkidle0',
            },
            selector: '#snap',
            viewport: { width: 1280, height: 1024 },
          }),
        })
      : await fetch(remoteSnapshotUrl(code), { method: 'POST' })

    if (response.ok) {
      const blob = await response.blob()
      return Buffer.from(await blob.arrayBuffer())
    }
  } catch (e) {
    console.error(e)
  }

  return null
}
