// Textos en lenguaje claro para los valores que entrega la API

export const ROLE_OPTIONS = [
  { value: 'student', label: 'Estudiante' },
  { value: 'teacher', label: 'Docente' },
  { value: 'counselor', label: 'Consejero' },
  { value: 'professional', label: 'Profesional de apoyo' },
  { value: 'admin', label: 'Administrador de bienestar' },
]

export const URGENCY_OPTIONS = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
]

export const REQUEST_STATUS_OPTIONS = [
  { value: 'received', label: 'Recibida' },
  { value: 'classified', label: 'Clasificada' },
  { value: 'assigned', label: 'Asignada' },
  { value: 'in_progress', label: 'En atención' },
  { value: 'closed', label: 'Cerrada' },
]

export const APPOINTMENT_STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Agendada' },
  { value: 'completed', label: 'Realizada' },
  { value: 'cancelled', label: 'Cancelada' },
  { value: 'no_show', label: 'No asistió' },
]

export const MODALITY_OPTIONS = [
  { value: 'in_person', label: 'Presencial' },
  { value: 'online', label: 'En línea' },
]

export const REFERRAL_TYPE_OPTIONS = [
  { value: 'none', label: 'Sin derivación' },
  { value: 'internal', label: 'Derivación interna' },
  { value: 'external', label: 'Derivación externa' },
]

const labelOf = (options) => (value) => options.find((option) => option.value === value)?.label ?? value

export const roleLabel = labelOf(ROLE_OPTIONS)
export const urgencyLabel = labelOf(URGENCY_OPTIONS)
export const statusLabel = labelOf(REQUEST_STATUS_OPTIONS)
export const appointmentStatusLabel = labelOf(APPOINTMENT_STATUS_OPTIONS)
export const modalityLabel = labelOf([...MODALITY_OPTIONS, { value: 'hybrid', label: 'Híbrida' }])
export const referralTypeLabel = labelOf(REFERRAL_TYPE_OPTIONS)

export const STATUS_TONES = {
  received: 'info',
  classified: 'warning',
  assigned: 'warning',
  in_progress: 'success',
  closed: 'neutral',
  scheduled: 'info',
  completed: 'success',
  cancelled: 'neutral',
  no_show: 'danger',
}

export const URGENCY_TONES = { low: 'success', medium: 'warning', high: 'danger' }

// Fecha corta en español de Chile, ej. "7 nov 2026, 15:30"
export function formatDate(value, withTime = false) {
  if (!value) return '—'
  return new Date(value).toLocaleString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  })
}

// Convierte una lista de catálogo de la API en opciones para un <Select>
export const toOptions = (items = []) => items.map((item) => ({ value: item.id, label: item.name }))

// "1 caso", "3 casos"
export const countLabel = (count, singular, plural = `${singular}s`) => `${count} ${count === 1 ? singular : plural}`
