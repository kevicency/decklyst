import type { PrismaClient } from '@prisma/client'
import type { Session } from 'next-auth'

export type ModelContext = {
  prisma: PrismaClient
  session: Session | null
}
