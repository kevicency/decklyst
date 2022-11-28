import type { User } from '@prisma/client'
import cx from 'classnames'
import Link from 'next/link'
import type { FC } from 'react'

export const ProfileLink: FC<{ user?: Pick<User, 'id' | 'name'> | null; className?: string }> = ({
  user,
  className,
}) =>
  user ? (
    <Link
      className={cx(className, `font-semibold text-accent-400 hover:underline`)}
      href={{ pathname: '/profile/[userId]', query: { userId: user.id } }}
    >
      {user.name}
    </Link>
  ) : (
    <span className="font-semibold text-gray-300">Anonymous</span>
  )
