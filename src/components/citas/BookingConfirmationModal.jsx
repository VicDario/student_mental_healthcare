import { Link } from 'react-router'
import Button from '../ui/Button'

// Modal de comprobante tras confirmar con éxito la cita
export default function BookingConfirmationModal({ appointment, onClose }) {
  if (!appointment) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-elevated animate-in fade-in zoom-in-95 duration-150">
        <div className="text-center pb-4 border-b border-border-subtle">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-forest-100 text-2xl">
            ✓
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
            Reserva Confirmada
          </span>
          <h3 className="text-xl font-extrabold text-title">¡Cita Agendada con Éxito!</h3>
          <p className="mt-1 text-xs text-muted">
            Folio: <strong className="font-mono text-title">{appointment.folio}</strong>
          </p>
        </div>

        <div className="my-4 space-y-2.5 rounded-lg border border-border-subtle bg-page p-3.5 text-xs">
          <div className="flex justify-between">
            <span className="text-muted">Estudiante:</span>
            <strong className="text-title">{appointment.studentName}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Profesional:</span>
            <span className="text-title">{appointment.providerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Fecha y Horario:</span>
            <strong className="text-forest-800">
              {appointment.dayLabel} • {appointment.timeSlot}
            </strong>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Modalidad:</span>
            <span className="text-title">{appointment.modality}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Área de Apoyo:</span>
            <span className="text-title">{appointment.category}</span>
          </div>
        </div>

        <p className="mb-4 text-center text-xs text-muted">
          Hemos enviado un correo de confirmación con las indicaciones de acceso y protocolo de atención.
        </p>

        <div className="flex flex-col gap-2">
          <Button variant="primary" onClick={onClose} className="w-full">
            Entendido
          </Button>
          <Link
            to="/"
            className="text-center text-xs font-semibold text-muted hover:text-title py-1 transition"
          >
            Volver a la Portada
          </Link>
        </div>
      </div>
    </div>
  )
}
