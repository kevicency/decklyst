import type { UserProfile } from '@/types'
import Head from 'next/head'
import type { FC } from 'react'

export const ProfileMetadata: FC<{ profile: UserProfile }> = ({ profile }) => (
  <Head>
    <title>{`${profile.name}'s Profile | Decklyst`}</title>
    <meta property="og:title" content={`${profile.name}'s Profile`} />
    <meta
      property="og:description"
      content={`Check out ${profile.name}'s ${profile.totalDecklysts} deck${
        profile.totalDecklysts === 1 ? '' : 's'
      } on Decklyst!`}
    />
    {profile.image && <meta property="og:image" content={profile.image} />}
  </Head>
)
