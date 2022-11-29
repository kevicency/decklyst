import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const anonymous = await prisma.user.upsert({
    where: { id: 'anonymous' },
    update: {},
    create: {
      id: 'anonymous',
      name: 'Anonymous',
    },
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
