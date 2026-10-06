import Badge from '../ui/Badge'
import Button from '../ui/Button'
import DetailHeader from '../ui/DetailHeader'
import Divider from '../ui/Divider'

const labelClass = 'mb-1 text-[0.8125rem] font-bold tracking-[0.05em] text-forest-900 uppercase'

function DetailField({ label, mono = false, children }) {
  return (
    <div className="mb-3.5">
      <p className={labelClass}>{label}</p>
      <p className={mono ? 'font-mono text-[0.85rem]' : 'text-[0.9375rem]'}>{children}</p>
    </div>
  )
}

const CHANGE_STYLES = {
  before: 'border-rose-500 bg-crisis-bg text-crisis-text',
  after: 'border-forest-500 bg-forest-50 text-forest-800',
}

function ChangeBlock({ variant, label, changes }) {
  return (
    <div className={`mb-2 rounded-sm border-l-3 px-3.5 py-3 text-[0.8125rem] ${CHANGE_STYLES[variant]}`}>
      <span className="mb-1 block font-bold">{label}</span>
      {changes.map(([field, value]) => (
        <span key={field} className="not-last:after:content-['_·_']">
          {field}: <strong>{value}</strong>
        </span>
      ))}
    </div>
  )
}

export default function LogDetail({ entry }) {
  return (
    <article aria-label={`Detalle de ${entry.id}`}>
      <DetailHeader
        code={entry.id}
        badge={<Badge tone={entry.type.tone}>{entry.type.label}</Badge>}
        sensitive={entry.sensitive}
      />

      <Divider />

      <DetailField label="Caso afectado">
        <strong>{entry.caseCode}</strong> — {entry.caseName}
      </DetailField>
      <DetailField label="Acción realizada">{entry.action}</DetailField>
      <DetailField label="Usuario responsable">
        {entry.user} — {entry.unit}
      </DetailField>
      <DetailField label="Fecha y hora">
        <time dateTime={entry.datetime}>{entry.longDateLabel}</time>
      </DetailField>
      <DetailField label="Dirección IP" mono>
        {entry.ip}
      </DetailField>

      <Divider />

      <p className={`${labelClass} mb-2.5`}>Cambios registrados</p>
      <ChangeBlock variant="before" label="Antes" changes={entry.changes.before} />
      <ChangeBlock variant="after" label="Después" changes={entry.changes.after} />

      <Divider />

      <Button variant="secondary">Exportar este registro</Button>
    </article>
  )
}
