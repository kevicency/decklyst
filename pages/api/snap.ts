// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import puppeteer from "puppeteer";

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto('http://localhost:3000')
    await page.emulateMediaType('screen')
    await page.waitForSelector("h1")

    const content = await page.$("h1")
    const imageBuffer = await content!.screenshot({ omitBackground: true });

    await page.close();
    await browser.close();

    res.setHeader("Content-Type", "image/png");
    res.send(imageBuffer);

    await browser.close()
}
