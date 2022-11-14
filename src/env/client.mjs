// @ts-check
import { clientEnv, clientSchema } from './schema.mjs'

const parsedEnv = clientSchema.safeParse(clientEnv)

export const formatErrors = (
  /** @type {import('zod').ZodFormattedError<Map<string,string>,string>} */
  errors,
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && '_errors' in value) return `${name}: ${value._errors.join(', ')}\n`
    })
    .filter(Boolean)

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:\n', ...formatErrors(parsedEnv.error.format()))
  throw new Error('Invalid environment variables')
}

for (let key of Object.keys(parsedEnv.data)) {
  if (!key.startsWith('NEXT_PUBLIC_')) {
    console.warn(
      `❌ Invalid public environment variable name: ${key}. It must begin with 'NEXT_PUBLIC_'`,
    )

    throw new Error('Invalid public environment variable name')
  }
}

export const env = parsedEnv.data
