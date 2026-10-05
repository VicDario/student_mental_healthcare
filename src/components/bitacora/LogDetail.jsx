import { Fragment, useState } from 'react'
import { LOG_TYPES } from '../../data/auditLog'
import { findOption } from '../../data/catalogs'
import { formatLongDateTime } from '../../utils/dates'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import DetailHeader from '../ui/DetailHeader'
import Divider from '../ui/Divider'
import Notice from '../ui/Notice'

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
      {changes.map(([field, value], index) => (
        <Fragment key={field}>
          {index > 0 && ' · '}
          {field}: <strong>{value}</strong>
        </Fragment>
      ))}
    </div>
  )
}

export default function LogDetail({ entry }) {
  const [exportMessage, setExportMessage] = useState('')
  const type = findOption(LOG_TYPES, entry.type)

  const handleExport = () => {
    setExportMessage(`Registro ${entry.id} preparado para exportación. Revisa la bandeja de descargas.`)
  }

  return (
    <article aria-label={`Detalle de ${entry.id}`}>
      <DetailHeader
        code={entry.id}
        badge={<Badge tone={type.tone}>{type.label}</Badge>}
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
        <time dateTime={entry.datetime}>{formatLongDateTime(entry.datetime)}</time>
      </DetailField>
      <DetailField label="Dirección IP" mono>
        {entry.ip}
      </DetailField>

      {entry.changes && (
        <>
          <Divider />
          <p className={`${labelClass} mb-2.5`}>Cambios registrados</p>
          <ChangeBlock variant="before" label="Antes" changes={entry.changes.before} />
          <ChangeBlock variant="after" label="Después" changes={entry.changes.after} />
        </>
      )}

      <Divider />

      <Button variant="secondary" onClick={handleExport}>
        Exportar este registro
      </Button>
      {exportMessage && <Notice className="mt-3">{exportMessage}</Notice>}
    </article>
  )
}
