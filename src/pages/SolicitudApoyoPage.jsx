import DashboardPage from '../components/layout/DashboardPage'
import SolicitudesHistorial from '../components/solicitud/SolicitudesHistorial'
import SolicitudForm from '../components/solicitud/SolicitudForm'
import SolicitudPasos from '../components/solicitud/SolicitudPasos'
import Panel from '../components/ui/Panel'
import PrivacyNote from '../components/ui/PrivacyNote'
import SummaryBox from '../components/ui/SummaryBox'
import Workspace from '../components/ui/Workspace'
import { MY_REQUESTS, NEXT_STEPS, STUDENT } from '../data/supportRequests'

export default function SolicitudApoyoPage() {
  return (
    <DashboardPage
      title="Crear una solicitud de apoyo"
      subtitle="Cuéntanos qué necesitas. Un consejero revisará tu solicitud, la clasificará y la asignará al profesional que corresponda."
    >
      <Workspace>
        <div className="flex min-w-0 flex-col gap-6">
          <Panel id="history-title" title="Mis solicitudes anteriores" count={`${MY_REQUESTS.length} solicitudes`}>
            <SolicitudesHistorial requests={MY_REQUESTS} />
          </Panel>

          <Panel id="request-form-title" title="Nueva solicitud">
            <SummaryBox eyebrow="Solicitud registrada a nombre de">{STUDENT}</SummaryBox>
            <SolicitudForm />
            <PrivacyNote title="Confidencialidad">
              Tu solicitud solo la revisan orientadores y profesionales autorizados de la Unidad de Bienestar. Escribe con
              tus palabras, no necesitas usar términos técnicos.
            </PrivacyNote>
          </Panel>
        </div>

        <Panel id="next-steps-title" title="Qué ocurre después de enviar">
          <SolicitudPasos steps={NEXT_STEPS} />
        </Panel>
      </Workspace>
    </DashboardPage>
  )
}
