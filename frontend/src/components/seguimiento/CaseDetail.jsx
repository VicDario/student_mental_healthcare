import { useApi } from '../../hooks/useApi'
import {
  appointmentStatusLabel,
  formatDate,
  modalityLabel,
  referralTypeLabel,
  STATUS_TONES,
  statusLabel,
  urgencyLabel,
} from '../../utils/labels'
import Badge from '../ui/Badge'
import DetailHeader from '../ui/DetailHeader'
import Divider from '../ui/Divider'
import LoadState from '../ui/LoadState'
import SummaryBox from '../ui/SummaryBox'
import CaseTimeline from './CaseTimeline'
import CloseCaseForm from './CloseCaseForm'
import FollowUpForm from './FollowUpForm'

// Une los cambios de estado y las observaciones en un solo historial ordenado por fecha
function buildTimeline(request, followUps) {
  const changes = request.statusHistory.map((change, index) => ({
    key: `status-${index}`,
    date: change.changedAt,
    title: `Estado: ${statusLabel(change.status)}`,
  }))
  const notes = followUps.map((followUp) => ({
    key: followUp.id,
    date: followUp.createdAt,
    title: `Observación de ${followUp.author?.name ?? 'el equipo'}`,
    description: followUp.text,
    note: true,
  }))
  return [...changes, ...notes].sort((a, b) => new Date(a.date) - new Date(b.date))
}

export default function CaseDetail({ requestId, canEdit, onChanged }) {
  const detail = useApi(`/requests/${requestId}`)
  const followUps = useApi(`/requests/${requestId}/follow-ups`)
  const appointments = useApi(`/appointments?request=${requestId}`)
  const request = detail.data

  function refresh() {
    detail.reload()
    followUps.reload()
    appointments.reload()
    onChanged()
  }

  return (
    <LoadState loading={detail.loading} error={detail.error} empty={!request}>
      {request && (
        <>
          <DetailHeader
            code={request.code}
            badge={<Badge tone={STATUS_TONES[request.status]}>{statusLabel(request.status)}</Badge>}
            sensitive={request.priority === 'high'}
          />

          <SummaryBox eyebrow={request.reason}>
            <p className="text-[0.9rem] whitespace-pre-line">{request.description}</p>
            <p className="mt-2 text-[0.8125rem] text-muted">
              {request.student?.name} · {request.type?.name ?? 'Sin clasificar'} · Prioridad{' '}
              {request.priority ? urgencyLabel(request.priority).toLowerCase() : '—'} · Responsable:{' '}
              {request.assignedTo?.name ?? 'sin asignar'}
            </p>
          </SummaryBox>

          <Divider />
          <CaseTimeline items={buildTimeline(request, followUps.data ?? [])} />

          {appointments.data?.length > 0 && (
            <>
              <Divider />
              <h3 className="mb-3 text-[0.9375rem] font-bold text-title">Citas</h3>
              <ul className="flex flex-col gap-2 text-[0.875rem]">
                {appointments.data.map((appointment) => (
                  <li key={appointment.id} className="flex flex-wrap items-center justify-between gap-2">
                    <span>
                      {formatDate(appointment.startsAt, true)} · {modalityLabel(appointment.modality)}
                    </span>
                    <Badge tone={STATUS_TONES[appointment.status]}>{appointmentStatusLabel(appointment.status)}</Badge>
                  </li>
                ))}
              </ul>
            </>
          )}

          {request.closure && (
            <>
              <Divider />
              <h3 className="mb-1 text-[0.9375rem] font-bold text-title">Cierre del caso</h3>
              <p className="text-[0.875rem] text-muted">
                {request.closure.reason} · {referralTypeLabel(request.closure.referralType)}
                {request.closure.referralDestination ? `: ${request.closure.referralDestination}` : ''}
              </p>
            </>
          )}

          {canEdit && ['assigned', 'in_progress'].includes(request.status) && (
            <>
              <Divider />
              <FollowUpForm requestId={request.id} onSaved={refresh} />
            </>
          )}

          {canEdit && request.status !== 'closed' && (
            <>
              <Divider />
              <h3 className="mb-1 text-[0.9375rem] font-bold text-title">Registrar cierre de caso</h3>
              <p className="mb-4 text-[0.8125rem] text-muted">
                Indica el motivo y si derivaste al estudiante. El cierre queda registrado en la bitácora.
              </p>
              <CloseCaseForm requestId={request.id} onSaved={refresh} />
            </>
          )}
        </>
      )}
    </LoadState>
  )
}
