import { useMemo, useState } from 'react'
import { countLabel } from '../../utils/labels'
import { kindLabel, scheduleLabel, WORKSHOP_STATUS } from '../../utils/workshops'
import Badge from '../ui/Badge'
import Panel from '../ui/Panel'

const FILTERS = [
  ['all', 'Todos'],
  ['available', 'Disponibles'],
  ['critical', 'Cupos críticos'],
  ['full', 'Completos'],
]

const ratioOf = (workshop) => workshop.takenSeats / workshop.capacity

function matchesFilter(workshop, filter) {
  const ratio = ratioOf(workshop)
  if (filter === 'available') return ratio < 0.9
  if (filter === 'critical') return ratio >= 0.9 && ratio < 1
  if (filter === 'full') return ratio >= 1
  return true
}

// Tabla de talleres con búsqueda y filtro por cupos
export default function TallerTable({ workshops, onSelectTaller, onCancel }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const text = search.toLowerCase()
    return workshops.filter(
      (workshop) =>
        matchesFilter(workshop, activeFilter) &&
        [workshop.title, workshop.category, workshop.facilitator?.name].some((value) => value?.toLowerCase().includes(text)),
    )
  }, [workshops, activeFilter, search])

  return (
    <Panel id="tabla-talleres" title="Talleres y actividades" count={countLabel(filtered.length, 'actividad', 'actividades')}>
      <div className="mb-5 flex flex-col gap-3.5 border-b border-border-subtle pb-4 lg:flex-row lg:items-center lg:justify-between">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Buscar talleres"
          placeholder="Buscar por actividad, facilitador o tema…"
          className="w-full max-w-sm rounded-full border border-border bg-page px-4 py-2 text-xs text-title focus:border-forest-500 focus:bg-white focus:outline-none"
        />
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setActiveFilter(value)}
              className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                activeFilter === value ? 'bg-forest-800 text-white shadow-xs' : 'bg-page text-muted hover:bg-forest-50 hover:text-forest-900'
              }`}
            >
              {label} ({workshops.filter((workshop) => matchesFilter(workshop, value)).length})
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-170 border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-border text-[0.75rem] font-bold tracking-wider text-muted uppercase">
              <th className="pb-3 pl-2">Actividad</th>
              <th className="pb-3">Facilitador(a)</th>
              <th className="pb-3">Horario y lugar</th>
              <th className="pb-3">Cupos</th>
              <th className="pb-3 pr-2 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {filtered.map((workshop) => {
              const pct = Math.round(ratioOf(workshop) * 100)
              const isFull = pct >= 100
              const isCritical = pct >= 90 && !isFull
              const status = WORKSHOP_STATUS[workshop.status]

              return (
                <tr key={workshop.id} className="transition hover:bg-forest-50/50">
                  <td className="py-3.5 pl-2">
                    <p className="text-[0.875rem] font-bold text-title">{workshop.title}</p>
                    <span className="mt-1 inline-flex flex-wrap gap-1">
                      <Badge tone="info">{kindLabel(workshop.kind)}</Badge>
                      {workshop.status !== 'scheduled' && <Badge tone={status.tone}>{status.label}</Badge>}
                    </span>
                  </td>
                  <td className="py-3.5 font-semibold text-title">{workshop.facilitator?.name ?? '—'}</td>
                  <td className="py-3.5">
                    <strong className="block text-title">{scheduleLabel(workshop)}</strong>
                    <small className="text-muted">
                      {[workshop.location, workshop.campus?.name].filter(Boolean).join(' · ') || 'Sin lugar definido'}
                    </small>
                  </td>
                  <td className="py-3.5">
                    <div className="w-28">
                      <div className="mb-1 flex items-baseline justify-between text-xs">
                        <strong className={isFull ? 'text-crisis-text' : 'text-title'}>
                          {workshop.takenSeats} / {workshop.capacity}
                        </strong>
                        <span className={`font-bold ${isFull ? 'text-crisis-text' : isCritical ? 'text-amber-600' : 'text-forest-700'}`}>
                          {isFull ? 'Lleno' : `${pct}%`}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${isFull ? 'bg-rose-500' : isCritical ? 'bg-amber-500' : 'bg-forest-600'}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-2 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onSelectTaller(workshop)}
                      className="cursor-pointer rounded-full border border-forest-300 bg-page px-3 py-1 font-semibold text-forest-800 transition hover:border-forest-600 hover:bg-forest-100"
                    >
                      Ver nómina
                    </button>
                    {workshop.status === 'scheduled' && (
                      <button
                        type="button"
                        onClick={() => onCancel(workshop)}
                        className="ml-1.5 cursor-pointer rounded-full border border-crisis-border px-3 py-1 font-semibold text-crisis-text transition hover:bg-crisis-bg"
                      >
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filtered.length === 0 && <div className="py-8 text-center text-xs text-muted">No hay actividades con este criterio.</div>}
      </div>
    </Panel>
  )
}
