import SensitivityIndicator from './SensitivityIndicator'

export default function DetailHeader({ code, badge, sensitive = false }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2.5">
      <p className="text-[0.8125rem] font-bold tracking-[0.06em] text-muted uppercase">{code}</p>
      {badge}
      {sensitive && <SensitivityIndicator />}
    </div>
  )
}
