'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
  fullWidth?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-navy text-white hover:bg-navy/90 border border-navy',
  secondary:
    'bg-accent text-white hover:bg-accent/90 border border-accent',
  outline:
    'bg-transparent text-navy border border-navy hover:bg-navy hover:text-white',
  ghost:
    'bg-transparent text-white border border-white/40 hover:border-white hover:bg-white/10',
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold',
        'transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
