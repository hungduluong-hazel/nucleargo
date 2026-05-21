interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  /** 'light' = white Nuclear (for dark backgrounds like navbar/sidebar)
   *  'dark'  = navy Nuclear (for light backgrounds like auth pages) */
  theme?: 'light' | 'dark'
}

const sizes = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
}

export default function Logo({ size = 'md', theme = 'light' }: LogoProps) {
  return (
    <span className={`font-bold tracking-tight ${sizes[size]}`}>
      <span className={theme === 'dark' ? 'text-navy' : 'text-white'}>Nuclear</span>
      <span className="text-accent">Go</span>
    </span>
  )
}
