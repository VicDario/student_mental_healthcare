import { Link } from 'react-router'
import Button from '../ui/Button'
import Divider from '../ui/Divider'
import PrivacyNote from '../ui/PrivacyNote'

// Tarjeta flotante con el resumen en vivo de la cita y confirmación
export default function BookingSummaryCard({
  provider,
  selectedDay,
  selectedTime,
  modality,
  consent,
  onConsentChange,
  onConfirm,
  disabled,
}) {
  return (
    <div className="sticky top-20 rounded-lg border border-border bg-card p-5 shadow-card sm:p-6">
      <h3 className="mb-4 border-b border-border-subtle pb-3 text-[1.125rem] font-bold text-title">
        Tu Cita de Apoyo
      </h3>

      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between border-b border-border-subtle/50 pb-2">
          <span className="text-muted">Profesional</span>
          <strong className="font-semibold text-title">{provider.name}</strong>
        </div>

        <div className="flex items-center justify-between border-b border-border-subtle/50 pb-2">
          <span className="text-muted">Especialidad</span>
          <span className="text-title">{provider.specialty}</span>
        </div>

        <div className="flex items-center justify-between border-b border-border-subtle/50 pb-2">
          <span className="text-muted">Fecha</span>
          <strong className="font-bold text-forest-800">{selectedDay?.fullLabel}</strong>
        </div>

        <div className="flex items-center justify-between border-b border-border-subtle/50 pb-2">
          <span className="text-muted">Horario</span>
          <strong className="font-bold text-forest-800">{selectedTime} (45 min)</strong>
        </div>

        <div className="flex items-center justify-between pb-1">
          <span className="text-muted">Formato</span>
          <span className="font-medium text-title">
            {modality === 'Presencial' ? 'Presencial (Box 102)' : 'Virtual (Videollamada Segura)'}
          </span>
        </div>
      </div>

      <Divider />

      <div className="mb-5">
        <label className="flex items-start gap-2.5 text-xs text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => onConsentChange(e.target.checked)}
            className="mt-0.5 rounded-sm border-border text-forest-800 focus:ring-forest-500"
          />
          <span>Acepto el protocolo de confidencialidad y asistencia institucional.</span>
        </label>
      </div>

      <Button
        type="button"
        variant="primary"
        onClick={onConfirm}
        disabled={disabled || !consent}
        className="w-full text-center"
      >
        Confirmar y Agendar Cita
      </Button>

      <div className="mt-3 text-center">
        <Link
          to="/"
          className="text-xs font-semibold text-muted hover:text-forest-900 transition"
        >
          ✕ Cancelar y Volver al Inicio
        </Link>
      </div>

      <PrivacyNote title="Atención Institucional">
        Servicio confidencial y gratuito. Recibirás comprobante en tu correo institucional.
      </PrivacyNote>
    </div>
  )
}
