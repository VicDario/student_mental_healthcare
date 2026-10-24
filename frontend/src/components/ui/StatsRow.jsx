const VALUE_TONES = {
  default: 'text-title',
  success: 'text-forest-700',
  warning: 'text-warning-text',
  danger: 'text-crisis-text',
}

export default function StatsRow({ label, stats }) {
  return (
    <div role="region" aria-label={label} className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {stats.map(({ value, label: statLabel, tone = 'default' }) => (
        <div key={statLabel} className="rounded-md border border-border bg-card px-5 py-4 shadow-subtle">
          <p className={`mb-1 text-[1.6rem] leading-none font-extrabold ${VALUE_TONES[tone]}`}>{value}</p>
          <p className="text-[0.8125rem] font-medium text-muted">{statLabel}</p>
        </div>
      ))}
    </div>
  )
}
