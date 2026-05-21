'use client'

import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
  error?: string
}

export default function Input({ label, id, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-sm font-medium text-navy/80"
      >
        {label}
      </label>
      <input
        id={id}
        className={[
          'w-full rounded-md border px-3 py-2.5 text-sm text-navy placeholder:text-navy/40',
          'bg-white outline-none transition-colors',
          'focus:border-navy focus:ring-2 focus:ring-navy/10',
          error ? 'border-accent' : 'border-navy/20',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-accent">{error}</p>}
    </div>
  )
}
