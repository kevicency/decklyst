require('dotenv').config({ path: '.env.test', override: true })

beforeAll(() => {
  if (!/decklyst-test/.test(process.env.DATABASE_URL ?? '')) {
    console.error('DATABASE_URL must include decklyst-test')
    process.exit(1)
  }
  // execSync(`./node_modules/.bin/prisma db push --force-reset`, { stdio: 'inherit' })
})
