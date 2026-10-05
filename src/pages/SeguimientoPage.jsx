import DashboardPage from '../components/layout/DashboardPage'
import CaseDetail from '../components/seguimiento/CaseDetail'
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
import { CAMPUSES, findOption, labelOf, PRIORITIES, UNITS } from '../data/catalogs'
import { CASE_STATUSES, CASES, CLOSED_THIS_MONTH } from '../data/cases'
import { formatShortDate } from '../utils/dates'

const selectedCase = CASES[0]

const countByStatus = (status) => CASES.filter((caseItem) => caseItem.status === status).length

const STATS = [
  { value: CASES.length - countByStatus('closed'), label: 'Casos activos' },
  { value: countByStatus('pending'), label: 'Pendientes de revisión', tone: 'warning' },
  { value: countByStatus('ready'), label: 'Listos para cierre' },
  { value: CLOSED_THIS_MONTH, label: 'Cerrados este mes', tone: 'success' },
]

export default function SeguimientoPage() {
  return (
    <DashboardPage
      title="Seguimiento y cierre de casos"
      subtitle="Revisa el historial de intervenciones de cada caso activo, registra avances y formaliza el cierre cuando el proceso de acompañamiento haya concluido satisfactoriamente."
    >
      <StatsRow label="Resumen de casos" stats={STATS} />

      <FilterBar label="Filtrar casos">
        <FormField id="filter-status" label="Estado" className="flex-[1_1_180px]">
          <Select id="filter-status" name="status" options={CASE_STATUSES} placeholder="Todos los estados" />
        </FormField>
        <FormField id="filter-unit" label="Unidad" className="flex-[1_1_180px]">
          <Select id="filter-unit" name="unit" options={UNITS} placeholder="Todas las unidades" />
        </FormField>
        <FormField id="filter-case" label="Código de caso" className="flex-[1_1_180px]">
          <Input id="filter-case" name="code" placeholder="Ej. CAS-0089" />
        </FormField>
      </FilterBar>

      <Workspace balanced>
        <Panel id="case-list-title" title="Casos en curso" count={`${CASES.length} casos`}>
          <RecordList emptyMessage="No hay casos registrados.">
            {CASES.map((caseItem) => {
              const status = findOption(CASE_STATUSES, caseItem.status)
              const priority = findOption(PRIORITIES, caseItem.priority)

              return (
                <RecordCard
                  key={caseItem.id}
                  code={caseItem.id}
                  badge={<Badge tone={status.tone}>{status.label}</Badge>}
                  meta={[caseItem.professional, labelOf(UNITS, caseItem.unit), labelOf(CAMPUSES, caseItem.campus)]}
                  footerStart={`${caseItem.status === 'pending' ? 'Recibido' : 'Último contacto'}: ${formatShortDate(caseItem.lastContact)}`}
                  actionLabel={<Badge tone={priority.tone}>{priority.label}</Badge>}
                  selected={caseItem.id === selectedCase.id}
                >
                  <p className="font-semibold text-title">{caseItem.title}</p>
                </RecordCard>
              )
            })}
          </RecordList>
        </Panel>

        <Panel id="case-detail-title" title="Seguimiento del caso">
          <CaseDetail caseItem={selectedCase} />

          <PrivacyNote title="Confidencialidad">
            Toda la información registrada en este seguimiento es de carácter reservado. El cierre de un caso queda
            registrado permanentemente en la bitácora del sistema junto con la identidad del profesional que lo
            autorizó.
          </PrivacyNote>
        </Panel>
      </Workspace>
    </DashboardPage>
  )
}
