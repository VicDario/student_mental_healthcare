import { useMemo, useState } from 'react'
import Badge from '../ui/Badge'

// Tabla de gestión operativa con filtrado por cupos y búsqueda de talleres
export default function TallerTable({ workshops, onSelectTaller }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filteredWorkshops = useMemo(() => {
    return workshops.filter((taller) => {
      // Filtro de texto
      const matchesSearch =
        taller.title.toLowerCase().includes(search.toLowerCase()) ||
        taller.facilitator.toLowerCase().includes(search.toLowerCase()) ||
        taller.category.toLowerCase().includes(search.toLowerCase())

      if (!matchesSearch) return false

      const ratio = taller.enrolled / taller.capacity
      if (activeFilter === 'available') return ratio < 0.9
      if (activeFilter === 'critical') return ratio >= 0.9 && ratio < 1
      if (activeFilter === 'full') return ratio >= 1
      return true
    })
  }, [workshops, activeFilter, search])

  const counts = useMemo(() => {
    return {
      all: workshops.length,
      available: workshops.filter((w) => w.enrolled / w.capacity < 0.9).length,
      critical: workshops.filter((w) => {
        const r = w.enrolled / w.capacity
        return r >= 0.9 && r < 1
      }).length,
      full: workshops.filter((w) => w.enrolled / w.capacity >= 1).length,
    }
  }, [workshops])

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-subtle sm:p-6">
      {/* Barra de herramientas: Búsqueda y tabs de estado */}
      <div className="mb-5 flex flex-col gap-3.5 border-b border-border-subtle pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-sm">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrar por actividad, profesional o tema..."
            className="w-full rounded-full border border-border bg-page py-2 pr-4 pl-9 text-xs text-title focus:border-forest-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              activeFilter === 'all'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-page text-muted hover:bg-forest-50 hover:text-forest-900'
            }`}
          >
            Todos ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('available')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              activeFilter === 'available'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-page text-muted hover:bg-forest-50 hover:text-forest-900'
            }`}
          >
            Disponibles ({counts.available})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('critical')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              activeFilter === 'critical'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-page text-muted hover:bg-forest-50 hover:text-forest-900'
            }`}
          >
            Cupos Críticos ({counts.critical})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('full')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              activeFilter === 'full'
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-page text-muted hover:bg-forest-50 hover:text-forest-900'
            }`}
          >
            Completos ({counts.full})
          </button>
        </div>
      </div>

      {/* Tabla de nóminas de talleres */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-border text-[0.75rem] font-bold text-muted uppercase tracking-wider">
              <th className="pb-3 pl-2">Taller / Actividad</th>
              <th className="pb-3">Facilitador(a)</th>
              <th className="pb-3">Horario & Sede</th>
              <th className="pb-3">Estado de Cupos</th>
              <th className="pb-3 pr-2 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {filteredWorkshops.map((taller) => {
              const ratio = taller.enrolled / taller.capacity
              const pct = Math.round(ratio * 100)
              const isFull = pct >= 100
              const isCritical = pct >= 90 && !isFull

              return (
                <tr key={taller.id} className="hover:bg-forest-50/50 transition">
                  <td className="py-3.5 pl-2">
                    <p className="font-bold text-[0.875rem] text-title">{taller.title}</p>
                    <span className="mt-1 inline-block">
                      <Badge tone="info">{taller.category}</Badge>
                    </span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{taller.avatar}</span>
                      <div>
                        <strong className="block font-semibold text-title">{taller.facilitator}</strong>
                        <small className="text-muted">{taller.facilitatorRole}</small>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <strong className="block text-title">{taller.schedule}</strong>
                    <small className="text-muted">📍 {taller.location}</small>
                  </td>
                  <td className="py-3.5">
                    <div className="w-28">
                      <div className="mb-1 flex items-baseline justify-between text-xs">
                        <strong className={isFull ? 'text-crisis-text' : 'text-title'}>
                          {taller.enrolled} / {taller.capacity}
                        </strong>
                        <span
                          className={`font-bold ${
                            isFull ? 'text-crisis-text' : isCritical ? 'text-amber-600' : 'text-forest-700'
                          }`}
                        >
                          {isFull ? 'Lleno' : `${pct}%`}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isFull ? 'bg-rose-500' : isCritical ? 'bg-amber-500' : 'bg-forest-600'
                          }`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-2 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectTaller(taller)}
                      className="cursor-pointer rounded-full border border-forest-300 bg-page px-3 py-1 font-semibold text-forest-800 transition hover:border-forest-600 hover:bg-forest-100"
                    >
                      Ver Nómina
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filteredWorkshops.length === 0 && (
          <div className="py-8 text-center text-xs text-muted">
            No se encontraron actividades que coincidan con el criterio seleccionado.
          </div>
        )}
      </div>
    </div>
  )
}
