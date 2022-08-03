declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_VERCEL_URL?: string
    NEXT_PUBLIC_SITE_URL?: string
    VERCEL_URL?: string
    SITE_URL?: string
    NODE_ENV: 'development' | 'production'
  }
}
