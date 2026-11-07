import { useMemo, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import DashboardPage from '../components/layout/DashboardPage'
import NominaModal from '../components/talleres/NominaModal'
import TalleresEstudiante from '../components/talleres/TalleresEstudiante'
import TallerForm from '../components/talleres/TallerForm'
import TallerTable from '../components/talleres/TallerTable'
import ApiMessage from '../components/ui/ApiMessage'
import LoadState from '../components/ui/LoadState'
import StatsRow from '../components/ui/StatsRow'
import { useApi } from '../hooks/useApi'
import { useSubmit } from '../hooks/useSubmit'

function GestionTalleres() {
  const workshops = useApi('/workshops')
  const [selected, setSelected] = useState(null)
  const { submit, error, success } = useSubmit()
  const list = useMemo(() => workshops.data ?? [], [workshops.data])

  const stats = useMemo(() => {
    const scheduled = list.filter((workshop) => workshop.status === 'scheduled')
    const ratio = (workshop) => workshop.takenSeats / workshop.capacity
    return [
      { value: scheduled.length, label: 'Programados', tone: 'success' },
      { value: scheduled.reduce((sum, workshop) => sum + workshop.takenSeats, 0), label: 'Cupos ocupados' },
      { value: scheduled.filter((workshop) => ratio(workshop) >= 0.85 && ratio(workshop) < 1).length, label: 'Por completar cupos', tone: 'warning' },
      { value: scheduled.filter((workshop) => ratio(workshop) >= 1).length, label: 'Cupos agotados', tone: 'danger' },
    ]
  }, [list])

  async function cancelWorkshop(workshop) {
    if (!window.confirm(`¿Cancelar "${workshop.title}"? Los inscritos ya no podrán asistir.`)) return
    const done = await submit(
      () => api(`/workshops/${workshop.id}`, { method: 'DELETE' }),
      `"${workshop.title}" quedó cancelado. Se conserva el historial de inscripciones.`,
    )
    if (done) workshops.reload()
  }

  return (
    <>
      <StatsRow label="Métricas de talleres" stats={stats} />
      <ApiMessage error={error} success={success} />
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_360px]">
        <LoadState loading={workshops.loading} error={workshops.error} empty={false}>
          <TallerTable workshops={list} onSelectTaller={setSelected} onCancel={cancelWorkshop} />
        </LoadState>
        <TallerForm onCreated={workshops.reload} />
      </div>
      {selected && <NominaModal taller={selected} onClose={() => setSelected(null)} onChanged={workshops.reload} />}
    </>
  )
}

// Administradores y profesionales gestionan; el resto de los perfiles ve y se inscribe
export default function GestionarTalleresPage() {
  const { user } = useAuth()
  const manages = ['admin', 'professional'].includes(user.role)

  return (
    <DashboardPage
      title={manages ? 'Gestión de talleres y actividades' : 'Talleres preventivos'}
      subtitle={
        manages
          ? 'Publica actividades, controla los cupos y registra la asistencia de los inscritos.'
          : 'Actividades gratuitas de bienestar. Inscríbete y, si no puedes asistir, cancela para liberar tu cupo.'
      }
    >
      {manages ? <GestionTalleres /> : <TalleresEstudiante />}
    </DashboardPage>
  )
}
