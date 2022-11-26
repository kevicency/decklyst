import { getServerAuthSession } from '@/server/auth'
import { type NextApiRequest, type NextApiResponse } from 'next'

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res })

  if (session) {
    res.send(session)
  } else {
    res.send({
      error: 'You must be signed in to view the protected content on this page.',
    })
  }
}

export default restricted
