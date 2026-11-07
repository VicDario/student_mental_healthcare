export const KIND_OPTIONS = [
  { value: 'workshop', label: 'Taller' },
  { value: 'talk', label: 'Charla' },
  { value: 'activity', label: 'Actividad' },
]

export const WORKSHOP_MODALITY_OPTIONS = [
  { value: 'in_person', label: 'Presencial' },
  { value: 'online', label: 'En línea' },
  { value: 'hybrid', label: 'Híbrida' },
]

export const WORKSHOP_STATUS = {
  scheduled: { label: 'Programado', tone: 'success' },
  cancelled: { label: 'Cancelado', tone: 'neutral' },
  finished: { label: 'Finalizado', tone: 'info' },
}

export const ENROLLMENT_STATUS = {
  enrolled: { label: 'Inscrito', tone: 'info' },
  attended: { label: 'Asistió', tone: 'success' },
  cancelled: { label: 'Canceló', tone: 'neutral' },
}

export const kindLabel = (value) => KIND_OPTIONS.find((option) => option.value === value)?.label ?? value

// "mié 12 nov · 15:00 a 16:30"
export function scheduleLabel(workshop) {
  const start = new Date(workshop.startsAt)
  const end = new Date(workshop.endsAt)
  const day = start.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' })
  const time = (date) => date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
  return `${day} · ${time(start)} a ${time(end)}`
}
