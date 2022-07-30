// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { validateDeckcode } from '../../../lib/deckcode'
import absoluteUrl from 'next-absolute-url'
import puppeteer from 'puppeteer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { origin } = absoluteUrl(req)
  const deckcode = req.query.deckcode as string | undefined
  const deckcodeUrl = `${origin}/${encodeURIComponent(deckcode ?? '')}`

  if (!validateDeckcode(deckcode)) {
    return res.status(404).send('')
  }

  const browser = await launchPuppeteer()
  const page = await browser.newPage()
  await page.goto(deckcodeUrl)
  await page.emulateMediaType('screen')

  const selector = '#snap'
  await page.waitForSelector(selector)
  await new Promise((resolve) => setTimeout(resolve, 10))
  const content = await page.$(selector)
  const imageBuffer = await content!.screenshot({ omitBackground: true })

  await page.close()
  await browser.close()

  res.setHeader('Content-Type', 'image/png')
  res.send(imageBuffer)

  await browser.close()
}

async function launchPuppeteer() {
  if (process.env.VERCEL) {
    const chrome = require('chrome-aws-lambda')
    return await puppeteer.launch({
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    })
  } else {
    return await puppeteer.launch()
  }
}
