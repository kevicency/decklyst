// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { normalizeDeckcode, validateDeckcode } from '../../../lib/deckcode'
import absoluteUrl from 'next-absolute-url'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { origin } = absoluteUrl(req)
  const deckcode = normalizeDeckcode(req.query.deckcode as string | undefined)
  const deckcodeUrl = `${origin}/${encodeURIComponent(deckcode ?? '')}?snapshot=1`

  if (!validateDeckcode(deckcode)) {
    return res.status(404).send('')
  }

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
    const puppeteer = require('puppeteer-core')
    const browser = await puppeteer.launch({
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
      defaultViewport: { width: 1280, height: 1080 },
    })
    return { puppeteer, browser }
  } else {
    const puppeteer = require('puppeteer')
    const browser = await puppeteer.launch({
      args: ['--disable-setuid-sandbox', '--no-sandbox', '--no-zygote'],
      executablePath: '/usr/local/bin/chromium',
      defaultViewport: { width: 1280, height: 1080 },
    })
    return { puppeteer, browser }
  }
}
