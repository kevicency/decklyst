export const debase64 = (base64: string) => (base64 ? Buffer.from(base64, 'base64').toString() : '')
export const enbase64 = (str: string) => Buffer.from(str).toString('base64')
