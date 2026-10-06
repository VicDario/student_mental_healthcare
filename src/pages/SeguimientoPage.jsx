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
import { UNITS } from '../data/catalogs'
import { CASE_STATS, CASE_STATUSES, CASES } from '../data/cases'

export default function SeguimientoPage() {
  return (
    <DashboardPage
      title="Seguimiento y cierre de casos"
      subtitle="Revisa el historial de intervenciones de cada caso activo, registra avances y formaliza el cierre cuando el proceso de acompañamiento haya concluido satisfactoriamente."
    >
      <StatsRow label="Resumen de casos" stats={CASE_STATS} />

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
        <Panel id="case-list-title" title="Casos en curso" count="5 casos">
          <RecordList>
            {CASES.map((caseItem, index) => (
              <RecordCard
                key={caseItem.id}
                code={caseItem.id}
                badge={<Badge tone={caseItem.status.tone}>{caseItem.status.label}</Badge>}
                meta={[caseItem.professional, caseItem.unit, caseItem.campus]}
                footerStart={caseItem.contact}
                footerEnd={<Badge tone={caseItem.priority.tone}>{caseItem.priority.label}</Badge>}
                selected={index === 0}
              >
                <p className="font-semibold text-title">{caseItem.title}</p>
              </RecordCard>
            ))}
          </RecordList>
        </Panel>

        <Panel id="case-detail-title" title="Seguimiento del caso">
          <CaseDetail caseItem={CASES[0]} />

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
