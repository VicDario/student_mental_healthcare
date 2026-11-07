import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import DashboardPage from '../components/layout/DashboardPage'
import CaseDetail from '../components/seguimiento/CaseDetail'
import Badge from '../components/ui/Badge'
import FilterBar from '../components/ui/FilterBar'
import FormField from '../components/ui/form/FormField'
import Input from '../components/ui/form/Input'
import Select from '../components/ui/form/Select'
import LoadState from '../components/ui/LoadState'
import Panel from '../components/ui/Panel'
import PrivacyNote from '../components/ui/PrivacyNote'
import RecordCard from '../components/ui/RecordCard'
import RecordList from '../components/ui/RecordList'
import StatsRow from '../components/ui/StatsRow'
import Workspace from '../components/ui/Workspace'
import { useApi } from '../hooks/useApi'
import { countLabel, formatDate, REQUEST_STATUS_OPTIONS, STATUS_TONES, statusLabel, URGENCY_TONES, urgencyLabel } from '../utils/labels'

export default function SeguimientoPage() {
  const { user } = useAuth()
  const [status, setStatus] = useState('')
  const [code, setCode] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  // El profesional recibe solo sus casos asignados; consejero y admin, todos
  const cases = useApi('/requests')
  const all = cases.data ?? []
  const visible = all.filter(
    (item) => (!status || item.status === status) && (!code || item.code.toLowerCase().includes(code.toLowerCase())),
  )
  const count = (value) => all.filter((item) => item.status === value).length

  const stats = [
    { value: count('assigned'), label: 'Asignados sin iniciar', tone: 'warning' },
    { value: count('in_progress'), label: 'En atención', tone: 'success' },
    { value: count('received') + count('classified'), label: 'Por asignar' },
    { value: count('closed'), label: 'Cerrados' },
  ]

  return (
    <DashboardPage
      title="Seguimiento y cierre de casos"
      subtitle="Revisa el historial de cada caso, registra observaciones de seguimiento y formaliza el cierre cuando el acompañamiento haya concluido."
    >
      <StatsRow label="Resumen de casos" stats={stats} />

      <FilterBar label="Filtrar casos" onSubmit={cases.reload}>
        <FormField id="filter-status" label="Estado" className="flex-[1_1_180px]">
          <Select id="filter-status" value={status} onChange={(event) => setStatus(event.target.value)} options={REQUEST_STATUS_OPTIONS} placeholder="Todos los estados" />
        </FormField>
        <FormField id="filter-case" label="Código de solicitud" className="flex-[1_1_180px]">
          <Input id="filter-case" value={code} onChange={(event) => setCode(event.target.value)} placeholder="Ej. SOL-2026-0001" />
        </FormField>
      </FilterBar>

      <Workspace balanced>
        <Panel id="case-list-title" title="Casos" count={countLabel(visible.length, 'caso')}>
          <LoadState loading={cases.loading} error={cases.error} empty={!visible.length} emptyText="No hay casos con estos filtros.">
            <RecordList>
              {visible.map((item) => (
                <RecordCard
                  key={item.id}
                  code={item.code}
                  badge={<Badge tone={STATUS_TONES[item.status]}>{statusLabel(item.status)}</Badge>}
                  meta={[`Recibida el ${formatDate(item.createdAt)}`, item.origin === 'referral' ? 'Derivación docente' : 'Solicitud propia']}
                  footerEnd={
                    item.priority && <Badge tone={URGENCY_TONES[item.priority]}>Prioridad {urgencyLabel(item.priority).toLowerCase()}</Badge>
                  }
                  selected={item.id === selectedId}
                  onSelect={() => setSelectedId(item.id)}
                >
                  <p className="font-semibold text-title">{item.reason}</p>
                </RecordCard>
              ))}
            </RecordList>
          </LoadState>
        </Panel>

        <Panel id="case-detail-title" title="Seguimiento del caso">
          {selectedId ? (
            <CaseDetail
              key={selectedId}
              requestId={selectedId}
              canEdit={['professional', 'counselor'].includes(user.role)}
              onChanged={cases.reload}
            />
          ) : (
            <p className="text-[0.9rem] text-muted">Elige un caso de la lista para ver su historial.</p>
          )}

          <PrivacyNote title="Confidencialidad">
            Las observaciones de seguimiento se guardan cifradas y nunca las ven estudiantes ni docentes. Leerlas y cerrar
            un caso queda registrado en la bitácora del sistema.
          </PrivacyNote>
        </Panel>
      </Workspace>
    </DashboardPage>
  )
}
