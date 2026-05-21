interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
}

export default function Logo({ size = 'md' }: LogoProps) {
  return (
    <span className={`font-bold tracking-tight ${sizes[size]}`}>
      <span className="text-white">Nuclear</span>
      <span className="text-accent">Go</span>
    </span>
  )
}
