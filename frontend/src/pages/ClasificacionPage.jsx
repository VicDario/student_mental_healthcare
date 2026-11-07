import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import AssignForm from '../components/clasificacion/AssignForm'
import ClassifyForm from '../components/clasificacion/ClassifyForm'
import DashboardPage from '../components/layout/DashboardPage'
import Badge from '../components/ui/Badge'
import DetailHeader from '../components/ui/DetailHeader'
import Divider from '../components/ui/Divider'
import FilterBar from '../components/ui/FilterBar'
import FormField from '../components/ui/form/FormField'
import Select from '../components/ui/form/Select'
import LoadState from '../components/ui/LoadState'
import Panel from '../components/ui/Panel'
import PrivacyNote from '../components/ui/PrivacyNote'
import RecordCard from '../components/ui/RecordCard'
import RecordList from '../components/ui/RecordList'
import SummaryBox from '../components/ui/SummaryBox'
import Workspace from '../components/ui/Workspace'
import { useApi } from '../hooks/useApi'
import {
  countLabel,
  formatDate,
  REQUEST_STATUS_OPTIONS,
  STATUS_TONES,
  statusLabel,
  URGENCY_TONES,
  urgencyLabel,
} from '../utils/labels'

const QUEUE_STATUSES = REQUEST_STATUS_OPTIONS.filter((option) => option.value !== 'closed')

export default function ClasificacionPage() {
  const { user } = useAuth()
  const isCounselor = user.role === 'counselor'
  const [status, setStatus] = useState(isCounselor ? 'received' : 'classified')
  const [selectedId, setSelectedId] = useState(null)

  const queue = useApi(`/requests${status ? `?status=${status}` : ''}`)
  const detail = useApi(selectedId ? `/requests/${selectedId}` : null)
  const supportTypes = useApi(isCounselor ? '/catalogs?type=support_type' : null)
  // El consejero solo recibe al equipo que atiende casos; el admin filtra por perfil
  const staff = useApi(isCounselor ? '/users' : '/users?active=true')
  const staffList = (staff.data ?? []).filter((member) => ['professional', 'counselor'].includes(member.role))

  const request = detail.data
  const canClassify = isCounselor && request && ['received', 'classified'].includes(request.status)
  const canAssign = request && request.status !== 'received' && request.status !== 'closed'

  function handleSaved() {
    queue.reload()
    detail.reload()
  }

  return (
    <DashboardPage
      title={isCounselor ? 'Clasificación y asignación' : 'Asignación de solicitudes'}
      subtitle="Revisa las solicitudes recibidas, define el tipo de apoyo y la prioridad, y asígnalas al profesional que corresponda. Cada cambio queda registrado en la bitácora."
    >
      <FilterBar label="Filtrar solicitudes" onSubmit={queue.reload}>
        <FormField id="filter-status" label="Estado" className="flex-[1_1_220px]">
          <Select
            id="filter-status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value)
              setSelectedId(null)
            }}
            options={QUEUE_STATUSES}
            placeholder="Todas"
          />
        </FormField>
      </FilterBar>

      <Workspace>
        <Panel id="queue-title" title="Solicitudes" count={queue.data ? countLabel(queue.data.length, 'solicitud', 'solicitudes') : undefined}>
          <LoadState loading={queue.loading} error={queue.error} empty={!queue.data?.length} emptyText="No hay solicitudes con este estado.">
            <RecordList>
              {queue.data?.map((item) => (
                <RecordCard
                  key={item.id}
                  code={item.code}
                  badge={<Badge tone={URGENCY_TONES[item.perceivedUrgency]}>Urgencia {urgencyLabel(item.perceivedUrgency).toLowerCase()}</Badge>}
                  meta={[
                    <>
                      Recibida el <time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time>
                    </>,
                    item.origin === 'referral' ? 'Derivación docente' : 'Solicitud del estudiante',
                    statusLabel(item.status),
                  ]}
                  selected={item.id === selectedId}
                  onSelect={() => setSelectedId(item.id)}
                  footerEnd={<span className="text-[0.8125rem] font-semibold text-forest-700">{item.id === selectedId ? 'Revisando' : 'Revisar →'}</span>}
                >
                  <p className="font-semibold text-title">{item.reason}</p>
                </RecordCard>
              ))}
            </RecordList>
          </LoadState>
        </Panel>

        <Panel id="classify-title" title="Detalle de la solicitud">
          {!selectedId && <p className="text-[0.9rem] text-muted">Elige una solicitud de la lista para revisarla.</p>}
          {selectedId && (
            <LoadState loading={detail.loading} error={detail.error} empty={!request}>
              {request && (
                <>
                  <DetailHeader
                    code={request.code}
                    badge={<Badge tone={STATUS_TONES[request.status]}>{statusLabel(request.status)}</Badge>}
                    sensitive={request.perceivedUrgency === 'high'}
                  />
                  <SummaryBox eyebrow={request.reason}>
                    <p className="text-[0.9rem] whitespace-pre-line">{request.description}</p>
                    <p className="mt-2 text-[0.8125rem] text-muted">
                      {request.student?.name} · Contacto por {request.contact.channel === 'email' ? 'correo' : 'teléfono'}:{' '}
                      {request.contact.value}
                      {request.campus ? ` · ${request.campus.name}` : ''}
                    </p>
                  </SummaryBox>

                  {canClassify && (
                    <>
                      <h3 className="mb-3 text-[0.9375rem] font-bold text-title">Clasificar</h3>
                      <ClassifyForm key={request.id} request={request} supportTypes={supportTypes.data ?? []} onSaved={handleSaved} />
                    </>
                  )}

                  {canAssign && (
                    <>
                      {canClassify && <Divider />}
                      <h3 className="mb-3 text-[0.9375rem] font-bold text-title">Asignar a un profesional</h3>
                      <p className="mb-3 text-[0.8125rem] text-muted">
                        Tipo: <strong>{request.type?.name ?? 'Sin clasificar'}</strong> · Prioridad:{' '}
                        <strong>{request.priority ? urgencyLabel(request.priority) : '—'}</strong>
                      </p>
                      <AssignForm key={`${request.id}-assign`} request={request} staff={staffList} onSaved={handleSaved} />
                    </>
                  )}

                  {request.status === 'received' && !isCounselor && (
                    <p className="text-[0.875rem] text-muted">Un consejero debe clasificar esta solicitud antes de asignarla.</p>
                  )}
                </>
              )}
            </LoadState>
          )}

          <PrivacyNote title="Confidencialidad">
            Cada clasificación y asignación queda registrada con tu nombre, la fecha y la hora en la bitácora del sistema.
            Esta plataforma organiza la derivación administrativa y <em>no reemplaza</em> la atención profesional.
          </PrivacyNote>
        </Panel>
      </Workspace>
    </DashboardPage>
  )
}
