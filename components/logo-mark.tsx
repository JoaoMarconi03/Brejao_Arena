import type { CSSProperties } from "react"

export function LogoMark({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden="true">
      <path d="M12 2.5 L22.5 21 H1.5 Z" />
    </svg>
  )
}
