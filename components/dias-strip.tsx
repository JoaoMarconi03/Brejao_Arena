"use client"

const DIAS_SEMANA = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]

export function DiasStrip() {
  const hoje = new Date()
  const dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(hoje)
    d.setDate(hoje.getDate() + i)
    return {
      label: i === 0 ? "Hoje" : DIAS_SEMANA[d.getDay() === 0 ? 6 : d.getDay() - 1],
      dia: d.getDate(),
      isHoje: i === 0,
    }
  })

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
      {dias.map((d, i) => (
        <div
          key={i}
          className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-xl border text-sm font-medium transition-colors
            ${d.isHoje
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-muted-foreground bg-card"
            }`}
        >
          <span className="text-xs opacity-70">{d.label}</span>
          <span className="text-lg font-bold">{d.dia}</span>
        </div>
      ))}
    </div>
  )
}
