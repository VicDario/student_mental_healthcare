import { useMemo, useState } from 'react'
import DashboardPage from '../components/layout/DashboardPage'
import NominaModal from '../components/talleres/NominaModal'
import TallerForm from '../components/talleres/TallerForm'
import TallerTable from '../components/talleres/TallerTable'
import StatsRow from '../components/ui/StatsRow'
import { INITIAL_WORKSHOPS } from '../data/workshops'

// Pantalla operativa para la gestión, control de cupos y publicación de talleres grupales
export default function GestionarTalleresPage() {
  const [workshops, setWorkshops] = useState(INITIAL_WORKSHOPS)
  const [selectedTaller, setSelectedTaller] = useState(null)

  const handleCreated = (newTaller) => {
    setWorkshops((prev) => [newTaller, ...prev])
  }

  // Métricas dinámicas de cabecera usando StatsRow
  const stats = useMemo(() => {
    const vigentes = workshops.length
    const totalInscritos = workshops.reduce((acc, w) => acc + w.enrolled, 0)
    const porCompletar = workshops.filter((w) => {
      const r = w.enrolled / w.capacity
      return r >= 0.85 && r < 1
    }).length
    const agotados = workshops.filter((w) => w.enrolled >= w.capacity).length

    return [
      { value: vigentes, label: 'Talleres vigentes', tone: 'success' },
      { value: totalInscritos, label: 'Inscripciones activas', tone: 'default' },
      { value: porCompletar, label: 'Por completar cupos', tone: 'warning' },
      { value: agotados, label: 'Cupos agotados', tone: 'danger' },
    ]
  }, [workshops])

  return (
    <DashboardPage
      title="Consola Operativa de Actividades y Talleres"
      subtitle="Monitoreo de nóminas, control de aforos en tiempo real y apertura inmediata de convocatorias grupales."
    >
      <StatsRow label="Métricas de talleres" stats={stats} />

      {/* Grid Master-Detail: Tabla principal y formulario lateral */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_360px]">
        <TallerTable workshops={workshops} onSelectTaller={setSelectedTaller} />
        <TallerForm onCreated={handleCreated} />
      </div>

      {/* Modal para visualizar nómina de inscritos */}
      {selectedTaller && (
        <NominaModal taller={selectedTaller} onClose={() => setSelectedTaller(null)} />
      )}
    </DashboardPage>
  )
}
