import { useState } from 'react'
import { api } from '../api/client'
import DashboardPage from '../components/layout/DashboardPage'
import ApiMessage from '../components/ui/ApiMessage'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import FilterBar from '../components/ui/FilterBar'
import FormActions from '../components/ui/form/FormActions'
import FormField from '../components/ui/form/FormField'
import Input from '../components/ui/form/Input'
import Select from '../components/ui/form/Select'
import LoadState from '../components/ui/LoadState'
import Panel from '../components/ui/Panel'
import PrivacyNote from '../components/ui/PrivacyNote'
import Workspace from '../components/ui/Workspace'
import { useApi } from '../hooks/useApi'
import { useSubmit } from '../hooks/useSubmit'
import {
  APPOINTMENT_STATUS_OPTIONS,
  appointmentStatusLabel,
  countLabel,
  formatDate,
  MODALITY_OPTIONS,
  modalityLabel,
  STATUS_TONES,
} from '../utils/labels'

const EMPTY = { request: '', date: '', time: '', durationMinutes: '45', modality: 'in_person', location: '' }

// Acciones para cerrar una cita agendada
const STATUS_ACTIONS = [
  { status: 'completed', label: 'Realizada', variant: 'primary' },
  { status: 'no_show', label: 'No asistió', variant: 'secondary' },
  { status: 'cancelled', label: 'Cancelar', variant: 'secondary' },
]

function AppointmentForm({ requests, onCreated }) {
  const [form, setForm] = useState(EMPTY)
  const { submit, pending, error, success, fieldError } = useSubmit()
  const update = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))

  const options = requests.map((request) => ({ value: request.id, label: `${request.code} · ${request.reason}` }))

  async function handleSubmit(event) {
    event.preventDefault()
    const startsAt = form.date && form.time ? new Date(`${form.date}T${form.time}`).toISOString() : undefined
    const created = await submit(
      () =>
        api('/appointments', {
          method: 'POST',
          body: {
            request: form.request || undefined,
            startsAt,
            durationMinutes: Number(form.durationMinutes),
            modality: form.modality,
            location: form.location || undefined,
          },
        }),
      'Cita agendada. El estudiante recibió un aviso.',
    )
    if (created) {
      setForm(EMPTY)
      onCreated()
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <ApiMessage error={error} success={success} />
      <FormField id="appointment-request" label="Solicitud *" hint="Solo aparecen casos asignados o en atención." error={fieldError('request')}>
        <Select id="appointment-request" name="request" value={form.request} onChange={update} options={options} placeholder="Selecciona un caso" />
      </FormField>

      <div className="grid gap-x-4 sm:grid-cols-2">
        <FormField id="appointment-date" label="Fecha *" error={fieldError('startsAt')}>
          <Input id="appointment-date" name="date" type="date" value={form.date} onChange={update} />
        </FormField>
        <FormField id="appointment-time" label="Hora *">
          <Input id="appointment-time" name="time" type="time" value={form.time} onChange={update} />
        </FormField>
        <FormField id="appointment-duration" label="Duración (minutos)" error={fieldError('durationMinutes')}>
          <Input id="appointment-duration" name="durationMinutes" type="number" min="15" max="180" step="15" value={form.durationMinutes} onChange={update} />
        </FormField>
        <FormField id="appointment-modality" label="Modalidad *" error={fieldError('modality')}>
          <Select id="appointment-modality" name="modality" value={form.modality} onChange={update} options={MODALITY_OPTIONS} />
        </FormField>
      </div>

      <FormField id="appointment-location" label={form.modality === 'online' ? 'Enlace de la videollamada' : 'Lugar'}>
        <Input
          id="appointment-location"
          name="location"
          value={form.location}
          onChange={update}
          placeholder={form.modality === 'online' ? 'https://…' : 'Ej.: Box 102, Centro de Salud Estudiantil'}
        />
      </FormField>

      <FormActions>
        <Button type="submit" disabled={pending}>
          {pending ? 'Agendando…' : 'Agendar cita'}
        </Button>
      </FormActions>
    </form>
  )
}

export default function AgendarCitaPage() {
  const [status, setStatus] = useState('scheduled')
  const appointments = useApi(`/appointments${status ? `?status=${status}` : ''}`)
  const requests = useApi('/requests')
  const openRequests = (requests.data ?? []).filter((request) => ['assigned', 'in_progress'].includes(request.status))
  const { submit, error } = useSubmit()

  async function changeStatus(id, newStatus) {
    const saved = await submit(() => api(`/appointments/${id}/status`, { method: 'PATCH', body: { status: newStatus } }))
    if (saved) appointments.reload()
  }

  return (
    <DashboardPage
      title="Citas de atención"
      subtitle="Agenda citas para los casos que tienes asignados y registra si se realizaron. El estudiante ve sus citas, pero nunca las observaciones del caso."
    >
      <Workspace>
        <div className="flex min-w-0 flex-col gap-6">
          <FilterBar label="Filtrar citas" onSubmit={appointments.reload}>
            <FormField id="filter-status" label="Estado de la cita" className="flex-[1_1_200px]">
              <Select id="filter-status" value={status} onChange={(event) => setStatus(event.target.value)} options={APPOINTMENT_STATUS_OPTIONS} placeholder="Todas" />
            </FormField>
          </FilterBar>

          <Panel id="appointments-title" title="Citas" count={appointments.data ? countLabel(appointments.data.length, 'cita') : undefined}>
            <ApiMessage error={error} />
            <LoadState loading={appointments.loading} error={appointments.error} empty={!appointments.data?.length} emptyText="No hay citas con este estado.">
              <ul className="flex flex-col gap-2.5">
                {appointments.data?.map((appointment) => (
                  <li key={appointment.id} className="rounded-md border-[1.5px] border-border bg-page px-4 py-3.5">
                    <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[0.8125rem] font-bold tracking-[0.06em] text-muted uppercase">{appointment.request?.code}</p>
                      <Badge tone={STATUS_TONES[appointment.status]}>{appointmentStatusLabel(appointment.status)}</Badge>
                    </div>
                    <p className="font-semibold text-title">
                      {formatDate(appointment.startsAt, true)} · {appointment.student?.name}
                    </p>
                    <p className="text-[0.8125rem] text-muted">
                      {modalityLabel(appointment.modality)}
                      {appointment.location ? ` · ${appointment.location}` : ''} · {appointment.durationMinutes} min ·{' '}
                      {appointment.professional?.name}
                    </p>
                    {appointment.status === 'scheduled' && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {STATUS_ACTIONS.map((action) => (
                          <Button
                            key={action.status}
                            variant={action.variant}
                            className="px-3.5! py-1.5! text-[0.8125rem]!"
                            onClick={() => changeStatus(appointment.id, action.status)}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </LoadState>
          </Panel>
        </div>

        <Panel id="new-appointment-title" title="Agendar nueva cita">
          <LoadState loading={requests.loading} error={requests.error} empty={!openRequests.length} emptyText="No tienes casos asignados para agendar citas.">
            <AppointmentForm requests={openRequests} onCreated={appointments.reload} />
          </LoadState>
          <PrivacyNote title="Atención institucional">
            La cita queda a cargo del profesional asignado al caso. Servicio confidencial y gratuito.
          </PrivacyNote>
        </Panel>
      </Workspace>
    </DashboardPage>
  )
}
