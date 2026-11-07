import { ENTITY_LABELS, actionInfo } from '../../utils/audit'
import { formatDate, roleLabel } from '../../utils/labels'
import Badge from '../ui/Badge'
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

// Detalle de un registro. Solo muestra nombres de campos, nunca valores sensibles
export default function LogDetail({ entry }) {
  const action = actionInfo(entry.action)

  return (
    <article aria-label="Detalle del registro">
      <DetailHeader
        code={formatDate(entry.createdAt, true)}
        badge={<Badge tone={action.tone}>{action.label}</Badge>}
        sensitive={['view', 'close'].includes(entry.action)}
      />

      <Divider />

      <DetailField label="Elemento afectado">
        {entry.entity ? ENTITY_LABELS[entry.entity] ?? entry.entity : 'Sin elemento asociado'}
        {entry.entityId && <span className="block font-mono text-[0.8rem] text-muted">{entry.entityId}</span>}
      </DetailField>
      <DetailField label="Usuario responsable">
        {entry.user ? `${entry.user.name} (${entry.user.email})` : 'Usuario no identificado'}
        {entry.role && ` — ${roleLabel(entry.role)}`}
      </DetailField>
      <DetailField label="Fecha y hora">
        <time dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleString('es-CL')}</time>
      </DetailField>
      <DetailField label="Dirección IP" mono>
        {entry.ip ?? '—'}
      </DetailField>

      {entry.changedFields?.length > 0 && (
        <>
          <Divider />
          <p className={`${labelClass} mb-2.5`}>Campos modificados</p>
          <div className="flex flex-wrap gap-1.5">
            {entry.changedFields.map((field) => (
              <Badge key={field}>{field}</Badge>
            ))}
          </div>
          <p className="mt-2 text-[0.8125rem] text-muted">Por confidencialidad, la bitácora guarda qué cambió, pero no los valores.</p>
        </>
      )}
    </article>
  )
}
