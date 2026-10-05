import { useState } from 'react'
import LogDetail from '../components/bitacora/LogDetail'
import DashboardPage from '../components/layout/DashboardPage'
import Badge from '../components/ui/Badge'
import FilterBar from '../components/ui/FilterBar'
import FormField from '../components/ui/form/FormField'
import Input from '../components/ui/form/Input'
import Select from '../components/ui/form/Select'
import Panel from '../components/ui/Panel'
import PrivacyNote from '../components/ui/PrivacyNote'
import RecordCard from '../components/ui/RecordCard'
import RecordList from '../components/ui/RecordList'
import StatsRow from '../components/ui/StatsRow'
import Workspace from '../components/ui/Workspace'
import { AUDIT_STATS, LOG_ENTRIES, LOG_TYPES } from '../data/auditLog'
import { findOption } from '../data/catalogs'
import { formatDateTime } from '../utils/dates'

const DEFAULT_FILTERS = { from: '2026-09-01', to: '2026-09-06', type: '', code: '' }

function matchesFilters(entry, { from, to, type, code }) {
  const day = entry.datetime.slice(0, 10)
  return (
    (!from || day >= from) &&
    (!to || day <= to) &&
    (!type || entry.type === type) &&
    entry.caseCode.toLowerCase().includes(code.trim().toLowerCase())
  )
}

export default function BitacoraPage() {
  const [selectedId, setSelectedId] = useState(LOG_ENTRIES[0].id)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const visibleEntries = LOG_ENTRIES.filter((entry) => matchesFilters(entry, filters))
  const selectedEntry = LOG_ENTRIES.find((entry) => entry.id === selectedId)

  return (
    <DashboardPage
      title="Bitácora de accesos y modificaciones"
      subtitle="Registro auditado de cada acceso, modificación y restricción aplicada a casos sensibles. Toda acción queda vinculada al usuario, la fecha y la hora para garantizar la trazabilidad y el cumplimiento de la política de confidencialidad."
    >
      <StatsRow label="Resumen de actividad" stats={AUDIT_STATS} />

      <FilterBar label="Filtrar registros de bitácora" onApply={setFilters}>
        <FormField id="filter-from" label="Desde" className="flex-[1_1_150px]">
          <Input id="filter-from" name="from" type="date" defaultValue={DEFAULT_FILTERS.from} />
        </FormField>
        <FormField id="filter-to" label="Hasta" className="flex-[1_1_150px]">
          <Input id="filter-to" name="to" type="date" defaultValue={DEFAULT_FILTERS.to} />
        </FormField>
        <FormField id="filter-action" label="Tipo de acción" className="flex-[1_1_180px]">
          <Select id="filter-action" name="type" options={LOG_TYPES} placeholder="Todas las acciones" />
        </FormField>
        <FormField id="filter-case" label="Código de caso" className="flex-[1_1_180px]">
          <Input id="filter-case" name="code" placeholder="Ej. CAS-0089" />
        </FormField>
      </FilterBar>

      <Workspace>
        <Panel
          id="log-list-title"
          title="Registros de bitácora"
          count={`${visibleEntries.length} ${visibleEntries.length === 1 ? 'registro' : 'registros'}`}
        >
          <RecordList emptyMessage="No hay registros que coincidan con los filtros.">
            {visibleEntries.map((entry) => {
              const type = findOption(LOG_TYPES, entry.type)
              const selected = entry.id === selectedId

              return (
                <RecordCard
                  key={entry.id}
                  code={entry.id}
                  badge={<Badge tone={type.tone}>{type.label}</Badge>}
                  meta={[
                    <>
                      Caso <strong>{entry.caseCode}</strong>
                    </>,
                    entry.user,
                    entry.unit,
                  ]}
                  footerStart={<time dateTime={entry.datetime}>{formatDateTime(entry.datetime)}</time>}
                  actionLabel={selected ? 'Viendo detalle' : 'Ver detalle'}
                  selected={selected}
                  onSelect={() => setSelectedId(entry.id)}
                >
                  <p className="font-medium text-title">{entry.summary}</p>
                </RecordCard>
              )
            })}
          </RecordList>
        </Panel>

        <Panel id="log-detail-title" title="Detalle del registro">
          <LogDetail key={selectedEntry.id} entry={selectedEntry} />

          <PrivacyNote title="Trazabilidad">
            Este registro forma parte de la auditoría del sistema y no puede ser editado ni eliminado. Cualquier
            intento de modificación queda igualmente registrado con la identidad del usuario y la marca de tiempo.
          </PrivacyNote>
        </Panel>
      </Workspace>
    </DashboardPage>
  )
}
