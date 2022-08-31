import superjson from 'superjson'

superjson.registerCustom<Buffer, number[]>(
  {
    isApplicable: (v): v is Buffer => v instanceof Buffer,
    serialize: (v) => Array.from(v),
    deserialize: (v) => Buffer.from(v),
  },
  'buffer',
)

export const transformer = superjson
