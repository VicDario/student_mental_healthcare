import { api } from '../../api/client'
import { useApi } from '../../hooks/useApi'
import { useSubmit } from '../../hooks/useSubmit'
import { kindLabel, scheduleLabel } from '../../utils/workshops'
import ApiMessage from '../ui/ApiMessage'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import LoadState from '../ui/LoadState'
import Panel from '../ui/Panel'

// Vista del estudiante: talleres programados, inscripción y cancelación
export default function TalleresEstudiante() {
  const workshops = useApi('/workshops?status=scheduled')
  const { submit, error, success } = useSubmit()

  async function enroll(workshop) {
    const done = await submit(
      () => api(`/workshops/${workshop.id}/enrollments`, { method: 'POST' }),
      `Te inscribiste en "${workshop.title}".`,
    )
    if (done) workshops.reload()
  }

  async function cancel(workshop) {
    const done = await submit(
      () => api(`/workshops/${workshop.id}/enrollments`, { method: 'DELETE' }),
      `Cancelaste tu inscripción en "${workshop.title}". Tu cupo quedó libre para otra persona.`,
    )
    if (done) workshops.reload()
  }

  return (
    <Panel id="talleres-title" title="Talleres y charlas disponibles">
      <ApiMessage error={error} success={success} />
      <LoadState loading={workshops.loading} error={workshops.error} empty={!workshops.data?.length} emptyText="No hay talleres programados por ahora.">
        <ul className="grid gap-4 md:grid-cols-2">
          {workshops.data?.map((workshop) => {
            const free = workshop.capacity - workshop.takenSeats
            return (
              <li key={workshop.id} className="flex flex-col rounded-md border-[1.5px] border-border bg-page p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <Badge tone="info">{kindLabel(workshop.kind)}</Badge>
                  <Badge tone={free > 0 ? 'success' : 'danger'}>{free > 0 ? `${free} cupos libres` : 'Sin cupos'}</Badge>
                </div>
                <h3 className="text-[1rem] font-bold text-title">{workshop.title}</h3>
                {workshop.description && <p className="mt-1 text-[0.875rem] text-muted">{workshop.description}</p>}
                <p className="mt-2 text-[0.8125rem] text-muted">
                  {scheduleLabel(workshop)}
                  {workshop.location ? ` · ${workshop.location}` : ''}
                  {workshop.facilitator ? ` · ${workshop.facilitator.name}` : ''}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
                  {workshop.enrollmentStatus === 'attended' && <Badge tone="success">Asististe</Badge>}
                  {workshop.enrollmentStatus === 'enrolled' && (
                    <>
                      <Badge tone="success">Inscrito</Badge>
                      <Button variant="secondary" className="px-4! py-2! text-[0.875rem]!" onClick={() => cancel(workshop)}>
                        Cancelar inscripción
                      </Button>
                    </>
                  )}
                  {(workshop.enrollmentStatus == null || workshop.enrollmentStatus === 'cancelled') && (
                    <Button className="px-4! py-2! text-[0.875rem]!" disabled={free <= 0} onClick={() => enroll(workshop)}>
                      Inscribirme
                    </Button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </LoadState>
    </Panel>
  )
}
