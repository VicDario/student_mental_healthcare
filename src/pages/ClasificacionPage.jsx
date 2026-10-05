import ClassifyForm from '../components/clasificacion/ClassifyForm'
import DashboardPage from '../components/layout/DashboardPage'
import Badge from '../components/ui/Badge'
import FilterBar from '../components/ui/FilterBar'
import FormField from '../components/ui/form/FormField'
import Select from '../components/ui/form/Select'
import Panel from '../components/ui/Panel'
import PrivacyNote from '../components/ui/PrivacyNote'
import RecordCard from '../components/ui/RecordCard'
import RecordList from '../components/ui/RecordList'
import SummaryBox from '../components/ui/SummaryBox'
import Workspace from '../components/ui/Workspace'
import { CAMPUSES, findOption, labelOf, PRIORITIES, SUPPORT_TYPES } from '../data/catalogs'
import { REQUESTS } from '../data/requests'
import { formatDayMonth } from '../utils/dates'

const selectedRequest = REQUESTS[0]

export default function ClasificacionPage() {
  return (
    <DashboardPage
      title="Clasificación de solicitudes"
      subtitle="Revisa las solicitudes recibidas, asígnales un tipo de apoyo y deriva cada caso a la unidad que corresponda. La clasificación queda registrada en la bitácora del sistema."
    >
      <FilterBar label="Filtrar solicitudes">
        <FormField id="filter-type" label="Tipo de solicitud" className="flex-[1_1_180px]">
          <Select id="filter-type" name="type" options={SUPPORT_TYPES} placeholder="Todas" />
        </FormField>
        <FormField id="filter-urgency" label="Urgencia percibida" className="flex-[1_1_180px]">
          <Select id="filter-urgency" name="urgency" options={PRIORITIES} placeholder="Todas" />
        </FormField>
        <FormField id="filter-campus" label="Sede" className="flex-[1_1_180px]">
          <Select id="filter-campus" name="campus" options={CAMPUSES} placeholder="Todas" />
        </FormField>
      </FilterBar>

      <Workspace>
        <Panel id="queue-title" title="Solicitudes sin clasificar" count={`${REQUESTS.length} pendientes`}>
          <RecordList emptyMessage="No hay solicitudes pendientes.">
            {REQUESTS.map((request) => {
              const urgency = findOption(PRIORITIES, request.urgency)
              const selected = request.id === selectedRequest.id

              return (
                <RecordCard
                  key={request.id}
                  code={request.id}
                  badge={<Badge tone={urgency.tone}>Urgencia {urgency.label.toLowerCase()}</Badge>}
                  meta={[
                    <>
                      Recibida el <time dateTime={request.receivedAt}>{formatDayMonth(request.receivedAt)}</time>
                    </>,
                    labelOf(CAMPUSES, request.campus),
                    `Canal: ${request.channel}`,
                  ]}
                  actionLabel={selected ? 'Clasificando' : 'Clasificar'}
                  selected={selected}
                >
                  <p>
                    <strong className="font-semibold text-title">{request.summary}</strong> {request.detail}
                  </p>
                </RecordCard>
              )
            })}
          </RecordList>
        </Panel>

        <Panel id="classify-title" title="Clasificar solicitud">
          <SummaryBox eyebrow={selectedRequest.id}>{selectedRequest.summary}</SummaryBox>

          <ClassifyForm />

          <PrivacyNote title="Confidencialidad">
            Cada clasificación queda registrada con tu nombre, la fecha y la hora en la bitácora del sistema. Esta
            plataforma organiza la derivación administrativa y <em>no reemplaza</em> la atención profesional.
          </PrivacyNote>
        </Panel>
      </Workspace>
    </DashboardPage>
  )
}
