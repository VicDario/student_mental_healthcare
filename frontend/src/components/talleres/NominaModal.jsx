import { api } from '../../api/client'
import { useApi } from '../../hooks/useApi'
import { useSubmit } from '../../hooks/useSubmit'
import { formatDate } from '../../utils/labels'
import { ENROLLMENT_STATUS, scheduleLabel } from '../../utils/workshops'
import ApiMessage from '../ui/ApiMessage'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

// Inscritos de un taller (GET /api/workshops/:id/enrollments) y registro de asistencia
export default function NominaModal({ taller, onClose, onChanged }) {
  const enrollments = useApi(`/workshops/${taller.id}/enrollments`)
  const { submit, error } = useSubmit()

  async function markAttendance(enrollmentId) {
    const saved = await submit(() =>
      api(`/workshops/${taller.id}/enrollments/${enrollmentId}/attendance`, { method: 'PATCH' }),
    )
    if (saved) {
      enrollments.reload()
      onChanged()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs" role="dialog" aria-modal="true" aria-labelledby="nomina-title">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-elevated">
        <div className="flex items-start justify-between border-b border-border-subtle pb-4">
          <div>
            <span className="text-[0.75rem] font-bold tracking-wider text-forest-700 uppercase">Nómina de inscritos</span>
            <h3 id="nomina-title" className="text-lg font-bold text-title">{taller.title}</h3>
            <p className="text-xs text-muted">
              {scheduleLabel(taller)}
              {taller.location ? ` · ${taller.location}` : ''}
            </p>
          </div>
          <button onClick={onClose} className="cursor-pointer rounded-full p-1 text-muted hover:bg-page hover:text-title" aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="my-4">
          <ApiMessage error={error} />
          <p className="mb-3 text-xs font-semibold text-title">
            Cupos ocupados: {taller.takenSeats} / {taller.capacity}
          </p>
          <div className="max-h-72 overflow-y-auto rounded-lg border border-border-subtle bg-page p-2">
            {enrollments.loading && <p className="p-3 text-xs text-muted">Cargando…</p>}
            {enrollments.error && <p className="p-3 text-xs text-crisis-text">{enrollments.error.message}</p>}
            {enrollments.data?.length === 0 && <p className="p-3 text-xs text-muted">Todavía no hay inscritos.</p>}
            {enrollments.data?.length > 0 && (
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border-subtle text-muted">
                  <tr>
                    <th className="p-2">Estudiante</th>
                    <th className="p-2">Inscripción</th>
                    <th className="p-2 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {enrollments.data.map((enrollment) => (
                    <tr key={enrollment.id}>
                      <td className="p-2">
                        <span className="block font-medium text-title">{enrollment.student.name}</span>
                        <span className="text-muted">{enrollment.student.email}</span>
                      </td>
                      <td className="p-2 text-muted">{formatDate(enrollment.createdAt)}</td>
                      <td className="p-2 text-right">
                        {enrollment.status === 'enrolled' && taller.status !== 'cancelled' ? (
                          <Button variant="secondary" className="px-3! py-1! text-xs!" onClick={() => markAttendance(enrollment.id)}>
                            Marcar asistencia
                          </Button>
                        ) : (
                          <Badge tone={ENROLLMENT_STATUS[enrollment.status].tone}>{ENROLLMENT_STATUS[enrollment.status].label}</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}
