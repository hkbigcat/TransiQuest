interface ProgressProps {
  value: number
}

export function Progress({ value }: ProgressProps) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full border border-neonBlue/40 bg-black/40">
      <div
        className="h-full bg-gradient-to-r from-neonBlue to-neonGreen transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}
