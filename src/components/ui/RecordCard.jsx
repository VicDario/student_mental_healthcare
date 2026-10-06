export default function RecordCard({ code, badge, meta, footerStart, footerEnd, selected = false, children }) {
  const stateClass = selected
    ? '-translate-y-0.5 border-border-active bg-forest-50 shadow-card'
    : 'border-border bg-page hover:border-forest-400 hover:shadow-subtle'

  return (
    <li className={`rounded-md border-[1.5px] px-4 py-3.5 transition ${stateClass}`}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[0.8125rem] font-bold tracking-[0.06em] text-muted uppercase">{code}</p>
        {badge}
      </div>

      <div className="mb-2 text-[0.9375rem] leading-normal">{children}</div>

      <ul className="flex flex-wrap gap-x-2 gap-y-0.5 text-[0.8125rem] text-muted">
        {meta.map((item, index) => (
          <li key={index} className="not-last:after:ml-2 not-last:after:content-['·']">
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[0.8125rem] font-medium text-muted">{footerStart}</div>
        {footerEnd}
      </div>
    </li>
  )
}
