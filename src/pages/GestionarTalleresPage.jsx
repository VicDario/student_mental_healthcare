import { useMemo, useState } from 'react'
import DashboardPage from '../components/layout/DashboardPage'
import NominaModal from '../components/talleres/NominaModal'
import TallerForm from '../components/talleres/TallerForm'
import TallerTable from '../components/talleres/TallerTable'
import { INITIAL_WORKSHOPS } from '../data/workshops'

// Pantalla operativa para la gestión, control de cupos y publicación de talleres grupales
export default function GestionarTalleresPage() {
  const [workshops, setWorkshops] = useState(INITIAL_WORKSHOPS)
  const [selectedTaller, setSelectedTaller] = useState(null)

  const handleCreated = (newTaller) => {
    setWorkshops((prev) => [newTaller, ...prev])
  }

  // Métricas dinámicas de cabecera
  const stats = useMemo(() => {
    const vigentes = workshops.length
    const porCompletar = workshops.filter((w) => {
      const r = w.enrolled / w.capacity
      return r >= 0.85
    }).length
    return { vigentes, porCompletar }
  }, [workshops])

  return (
    <DashboardPage
      title="Consola Operativa de Actividades y Talleres"
      subtitle="Monitoreo de nóminas, control de aforos en tiempo real y apertura inmediata de convocatorias grupales."
    >
      {/* Chips de estado institucional */}
      <div className="mb-6 flex flex-wrap items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-200 bg-forest-100 px-3 py-1 text-xs font-bold text-forest-800">
          ● {stats.vigentes} Talleres Vigentes
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
          ▲ {stats.porCompletar} Por Completar Cupos
        </span>
      </div>

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
