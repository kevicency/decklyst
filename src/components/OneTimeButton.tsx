import cx from 'classnames'
import type { FC, MouseEventHandler } from 'react'
import React, { useState } from 'react'

export const OneTimeButton: FC<{
  onClick?: MouseEventHandler
  timeout?: number
  className?: string
  clickedClassName?: string
  href?: string
  download?: string
  disabled?: boolean
  children: (isClicked: boolean) => React.ReactNode
}> = ({ onClick, timeout, href, download, children, clickedClassName, className, disabled }) => {
  const [isClicked, setClicked] = useState(false)
  const Tag = href ? 'a' : 'button'

  const handleClick: MouseEventHandler = (ev) => {
    if (isClicked || disabled) {
      ev.preventDefault()
      return true
    }

    setClicked(true)
    setTimeout(() => {
      setClicked(false)
    }, timeout ?? 5000)

    onClick?.(ev)

    return false
  }

  return (
    <Tag
      href={href}
      download={download}
      onClick={handleClick}
      disabled={disabled}
      className={cx(
        'btn transition-colors',
        className,
        clickedClassName
          ? { clickedClassName: isClicked }
          : {
              'cursor-default bg-green-600 hover:bg-green-600': isClicked,
            },
      )}
    >
      {children(isClicked)}
    </Tag>
  )
}
