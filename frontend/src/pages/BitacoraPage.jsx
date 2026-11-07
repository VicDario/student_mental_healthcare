import { useState } from 'react'
import { toQuery } from '../api/client'
import LogDetail from '../components/bitacora/LogDetail'
import DashboardPage from '../components/layout/DashboardPage'
import Badge from '../components/ui/Badge'
import FilterBar from '../components/ui/FilterBar'
import FormField from '../components/ui/form/FormField'
import Select from '../components/ui/form/Select'
import LoadState from '../components/ui/LoadState'
import Panel from '../components/ui/Panel'
import PrivacyNote from '../components/ui/PrivacyNote'
import RecordCard from '../components/ui/RecordCard'
import RecordList from '../components/ui/RecordList'
import StatsRow from '../components/ui/StatsRow'
import Workspace from '../components/ui/Workspace'
import { useApi } from '../hooks/useApi'
import { AUDIT_ACTION_OPTIONS, ENTITY_LABELS, actionInfo } from '../utils/audit'
import { countLabel, formatDate, roleLabel } from '../utils/labels'

const LIMIT_OPTIONS = [50, 100, 200, 500].map((value) => ({ value: String(value), label: `Últimos ${value}` }))

export default function BitacoraPage() {
  const [action, setAction] = useState('')
  const [limit, setLimit] = useState('100')
  const [selected, setSelected] = useState(null)
  const logs = useApi(`/audit-logs${toQuery({ action, limit })}`)
  const entries = logs.data ?? []

  const today = new Date().toDateString()
  const count = (fn) => entries.filter(fn).length
  const stats = [
    { value: count((entry) => new Date(entry.createdAt).toDateString() === today), label: 'Registros de hoy' },
    { value: count((entry) => entry.action === 'view'), label: 'Consultas de datos sensibles', tone: 'warning' },
    { value: count((entry) => ['update', 'classify', 'assign', 'close'].includes(entry.action)), label: 'Modificaciones' },
    { value: count((entry) => entry.action === 'login_failed'), label: 'Ingresos fallidos', tone: 'danger' },
  ]

  return (
    <DashboardPage
      title="Bitácora de accesos y modificaciones"
      subtitle="Registro de cada ingreso, consulta y modificación sobre casos sensibles. Toda acción queda vinculada al usuario, la fecha, la hora y la IP."
    >
      <StatsRow label="Resumen de actividad" stats={stats} />

      <FilterBar label="Filtrar registros de bitácora" onSubmit={logs.reload}>
        <FormField id="filter-action" label="Tipo de acción" className="flex-[1_1_220px]">
          <Select id="filter-action" value={action} onChange={(event) => setAction(event.target.value)} options={AUDIT_ACTION_OPTIONS} placeholder="Todas las acciones" />
        </FormField>
        <FormField id="filter-limit" label="Cantidad" className="flex-[1_1_160px]">
          <Select id="filter-limit" value={limit} onChange={(event) => setLimit(event.target.value)} options={LIMIT_OPTIONS} />
        </FormField>
      </FilterBar>

      <Workspace>
        <Panel id="log-list-title" title="Registros" count={countLabel(entries.length, 'registro')}>
          <LoadState loading={logs.loading} error={logs.error} empty={!entries.length} emptyText="No hay registros con este filtro.">
            <RecordList>
              {entries.map((entry) => {
                const info = actionInfo(entry.action)
                return (
                  <RecordCard
                    key={entry.id}
                    code={formatDate(entry.createdAt, true)}
                    badge={<Badge tone={info.tone}>{info.label}</Badge>}
                    meta={[entry.user?.name ?? 'Usuario no identificado', entry.role ? roleLabel(entry.role) : 'Sin perfil', entry.ip ?? 'IP desconocida']}
                    selected={selected?.id === entry.id}
                    onSelect={() => setSelected(entry)}
                  >
                    <p className="font-medium text-title">{entry.entity ? ENTITY_LABELS[entry.entity] ?? entry.entity : 'Sesión'}</p>
                  </RecordCard>
                )
              })}
            </RecordList>
          </LoadState>
        </Panel>

        <Panel id="log-detail-title" title="Detalle del registro">
          {selected ? <LogDetail entry={selected} /> : <p className="text-[0.9rem] text-muted">Elige un registro para ver su detalle.</p>}
          <PrivacyNote title="Trazabilidad">
            La bitácora es de solo lectura: ningún perfil puede editarla ni eliminarla.
          </PrivacyNote>
        </Panel>
      </Workspace>
    </DashboardPage>
  )
}
