import { useAuth } from '../auth/AuthContext'
import DashboardPage from '../components/layout/DashboardPage'
import MisAvisos from '../components/solicitud/MisAvisos'
import SolicitudesHistorial from '../components/solicitud/SolicitudesHistorial'
import SolicitudForm from '../components/solicitud/SolicitudForm'
import SolicitudPasos from '../components/solicitud/SolicitudPasos'
import Badge from '../components/ui/Badge'
import LoadState from '../components/ui/LoadState'
import Panel from '../components/ui/Panel'
import PrivacyNote from '../components/ui/PrivacyNote'
import SummaryBox from '../components/ui/SummaryBox'
import Workspace from '../components/ui/Workspace'
import { useApi } from '../hooks/useApi'
import { appointmentStatusLabel, countLabel, formatDate, modalityLabel, STATUS_TONES } from '../utils/labels'

const NEXT_STEPS = [
  'Recibes un folio y un aviso de confirmación en esta pantalla.',
  'Un consejero revisa y clasifica tu caso.',
  'Se te asigna un profesional, que se comunicará contigo.',
  'Las citas que te agenden aparecen en "Mis citas".',
  'Puedes seguir el estado de tu caso desde esta misma pantalla.',
]

export default function SolicitudApoyoPage() {
  const { user } = useAuth()
  const requests = useApi('/requests')
  const notifications = useApi('/notifications')
  const appointments = useApi('/appointments')
  const unread = notifications.data?.filter((notification) => !notification.read).length ?? 0

  function handleCreated() {
    requests.reload()
    notifications.reload()
  }

  return (
    <DashboardPage
      title="Mis solicitudes de apoyo"
      subtitle="Cuéntanos qué necesitas. Un consejero revisará tu solicitud, la clasificará y la asignará al profesional que corresponda."
    >
      <Workspace>
        <div className="flex min-w-0 flex-col gap-6">
          <Panel
            id="history-title"
            title="Mis solicitudes"
            count={requests.data ? countLabel(requests.data.length, 'solicitud', 'solicitudes') : undefined}
          >
            <LoadState
              loading={requests.loading}
              error={requests.error}
              empty={!requests.data?.length}
              emptyText="Todavía no has enviado solicitudes."
            >
              <SolicitudesHistorial requests={requests.data ?? []} />
            </LoadState>
          </Panel>

          <Panel id="request-form-title" title="Nueva solicitud">
            <SummaryBox eyebrow="Solicitud registrada a nombre de">
              {user.name} · {user.email}
            </SummaryBox>
            <SolicitudForm defaultEmail={user.email} onCreated={handleCreated} />
            <PrivacyNote title="Confidencialidad">
              Tu solicitud solo la revisan orientadores y profesionales autorizados de la Unidad de Bienestar. Escribe con
              tus palabras, no necesitas usar términos técnicos.
            </PrivacyNote>
          </Panel>
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <Panel id="notices-title" title="Mis avisos" count={unread ? `${unread} sin leer` : undefined}>
            <LoadState
              loading={notifications.loading}
              error={notifications.error}
              empty={!notifications.data?.length}
              emptyText="No tienes avisos todavía."
            >
              <MisAvisos notifications={notifications.data ?? []} onChange={notifications.reload} />
            </LoadState>
          </Panel>

          <Panel id="appointments-title" title="Mis citas">
            <LoadState
              loading={appointments.loading}
              error={appointments.error}
              empty={!appointments.data?.length}
              emptyText="Aún no tienes citas agendadas."
            >
              <ul className="flex flex-col gap-2.5">
                {appointments.data?.map((appointment) => (
                  <li key={appointment.id} className="rounded-md border border-border bg-page px-4 py-3 text-[0.9rem]">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-title">{formatDate(appointment.startsAt, true)}</strong>
                      <Badge tone={STATUS_TONES[appointment.status]}>{appointmentStatusLabel(appointment.status)}</Badge>
                    </div>
                    <p className="mt-1 text-[0.8125rem] text-muted">
                      {appointment.professional?.name} · {modalityLabel(appointment.modality)}
                      {appointment.location ? ` · ${appointment.location}` : ''} · {appointment.durationMinutes} min
                    </p>
                  </li>
                ))}
              </ul>
            </LoadState>
          </Panel>

          <Panel id="next-steps-title" title="Qué ocurre después de enviar">
            <SolicitudPasos steps={NEXT_STEPS} />
          </Panel>
        </div>
      </Workspace>
    </DashboardPage>
  )
}
