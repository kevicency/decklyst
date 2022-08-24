import { deckUrl, remoteSnapshotUrl, snapshotUrl } from '@/common/urls'
import { Buffer } from 'node:buffer'

export const snapshot = (code: string) =>
  process.env.VERCEL ? snapshotBrowserless(code) : snapshotLocal(code)

export const snapshotLocal = async (code: string) => {
  const puppeteer = require('puppeteer')

  const browser = await puppeteer.launch({
    args: ['--disable-setuid-sandbox', '--no-sandbox', '--no-zygote'],
    defaultViewport: { width: 1280, height: 1080 },
  })

  try {
    const page = await browser.newPage()
    await page.emulateMediaType('screen')
    // await page.goto(deckUrl(code), { waitUntil: 'networkidle2' })
    await Promise.race([
      page.goto(deckUrl(code), { waitUntil: 'networkidle0' }),
      new Promise((resolve) => setTimeout(resolve, 7500)),
    ])
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
    const response = process.env.BROWSERLESS_API_TOKEN
      ? await fetch(
          `https://chrome.browserless.io/screenshot?token=${process.env.BROWSERLESS_API_TOKEN}`,
          {
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
                waitUntil: 'networkidle2',
              },
              selector: '#snap',
              viewport: { width: 1280, height: 1024 },
            }),
          },
        )
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
