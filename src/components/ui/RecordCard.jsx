export default function RecordCard({
  code,
  badge,
  meta = [],
  footerStart,
  actionLabel,
  selected = false,
  muted = false,
  onSelect,
  children,
}) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect()
    }
  }

  const stateClass = selected
    ? '-translate-y-0.5 border-border-active bg-forest-50 shadow-card'
    : 'border-border bg-page hover:border-forest-400 hover:shadow-subtle'

  const interactiveProps = onSelect
    ? { role: 'button', tabIndex: 0, 'aria-pressed': selected, onClick: onSelect, onKeyDown: handleKeyDown }
    : {}

  return (
    <li>
      <div
        {...interactiveProps}
        className={`rounded-md border-[1.5px] px-4 py-3.5 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-500 ${onSelect ? 'cursor-pointer' : ''} ${stateClass} ${muted ? 'opacity-60' : ''}`}
      >
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[0.8125rem] font-bold tracking-[0.06em] text-muted uppercase">{code}</p>
          {badge}
        </div>

        <div className="mb-2 text-[0.9375rem] leading-normal">{children}</div>

        {meta.length > 0 && (
          <ul className="flex flex-wrap gap-x-2 gap-y-0.5 text-[0.8125rem] text-muted">
            {meta.map((item, index) => (
              <li key={index} className="not-last:after:ml-2 not-last:after:content-['·']">
                {item}
              </li>
            ))}
          </ul>
        )}

        {(footerStart || actionLabel) && (
          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2">
            <div className="text-[0.8125rem] font-medium text-muted">{footerStart}</div>
            {typeof actionLabel === 'string' ? (
              <span className="rounded-full border-[1.5px] border-border px-3.5 py-1 text-[0.8125rem] font-semibold text-muted">
                {actionLabel}
              </span>
            ) : (
              actionLabel
            )}
          </div>
        )}
      </div>
    </li>
  )
}
