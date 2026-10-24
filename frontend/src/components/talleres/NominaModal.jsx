import Button from '../ui/Button'

// Modal para visualizar la nómina de inscritos de un taller
export default function NominaModal({ taller, onClose }) {
  if (!taller) return null

  // Alumnos ficticios para demostración de nómina
  const alumnos = [
    { nombre: 'Martina Silva', rut: '20.142.883-1', carrera: 'Ingeniería Civil', fecha: '28 Ago' },
    { nombre: 'Lucas Morales', rut: '21.033.419-K', carrera: 'Medicina', fecha: '28 Ago' },
    { nombre: 'Sofía Valdés', rut: '19.982.551-3', carrera: 'Psicología', fecha: '29 Ago' },
    { nombre: 'Benjamín Fuentes', rut: '20.519.802-7', carrera: 'Arquitectura', fecha: '30 Ago' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-elevated animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between border-b border-border-subtle pb-4">
          <div>
            <span className="text-[0.75rem] font-bold text-forest-700 uppercase tracking-wider">
              Nómina Oficial DAE
            </span>
            <h3 className="text-lg font-bold text-title">{taller.title}</h3>
            <p className="text-xs text-muted">
              {taller.schedule} • {taller.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted hover:bg-page hover:text-title"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <div className="my-4">
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-title">
              Inscritos confirmados: {taller.enrolled} / {taller.capacity}
            </span>
            <span className="rounded-full bg-forest-100 px-2.5 py-0.5 font-bold text-forest-800">
              {Math.round((taller.enrolled / taller.capacity) * 100)}% de ocupación
            </span>
          </div>

          <div className="max-h-60 overflow-y-auto rounded-lg border border-border-subtle bg-page p-2">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border-subtle text-muted">
                <tr>
                  <th className="p-2">Estudiante</th>
                  <th className="p-2">RUT</th>
                  <th className="p-2">Carrera</th>
                  <th className="p-2 text-right">Inscripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {alumnos.map((a, i) => (
                  <tr key={i} className="hover:bg-white/60">
                    <td className="p-2 font-medium text-title">{a.nombre}</td>
                    <td className="p-2 text-muted">{a.rut}</td>
                    <td className="p-2 text-muted">{a.carrera}</td>
                    <td className="p-2 text-right text-muted">{a.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              alert(`Descargando nómina oficial en PDF para: ${taller.title}`)
            }}
          >
            📥 Descargar Nómina (PDF)
          </Button>
        </div>
      </div>
    </div>
  )
}
