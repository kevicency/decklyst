import type { NextApiRequest, NextApiResponse } from 'next'
import puppeteer from 'puppeteer-core'

const env = {
  vercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  vercelEnv: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV,
}

export const siteUrl = env.vercelEnv === 'preview' ? `https://${env.vercelUrl}` : env.siteUrl

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const deckcode = ((req.query.deckcode as string | undefined) ?? '').trim()
  const deckcodeUrl = `${siteUrl}/${encodeURIComponent(deckcode)}?snapshot=1`

  const { browser } = await launchPuppeteer()
  const page = await browser.newPage()
  await page.goto(deckcodeUrl)
  await page.emulateMediaType('screen')

  const selector = '#snap'
  await page.waitForSelector(selector)
  await new Promise((resolve) => setTimeout(resolve, 1500))
  const content = await page.$(selector)
  const imageBuffer = await content!.screenshot({ omitBackground: true })

  await page.close()
  await browser.close()

  res.setHeader('Content-Type', 'image/png')
  res.send(imageBuffer)
}

async function launchPuppeteer() {
  if (process.env.VERCEL) {
    const chrome = require('chrome-aws-lambda')
    const browser = await puppeteer.launch({
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
      defaultViewport: { width: 1280, height: 1080 },
    })
    return { puppeteer, browser }
  } else {
    const browser = await puppeteer.launch({
      args: ['--disable-setuid-sandbox', '--no-sandbox', '--no-zygote'],
      executablePath: '/usr/local/bin/chromium',
      defaultViewport: { width: 1280, height: 1080 },
    })
    return { puppeteer, browser }
  }
}
