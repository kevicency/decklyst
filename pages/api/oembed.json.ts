import type { NextApiRequest, NextApiResponse } from 'next'

type Data = any

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    res.status(200).json({ version: "1.0", type: 'rich', html: "<h1>Hello World</h1>" })
}
