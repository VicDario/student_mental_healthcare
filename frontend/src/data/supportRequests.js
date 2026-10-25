// Datos de ejemplo para la pantalla "Crear solicitud de apoyo".
// Más adelante vendrán del backend.

export const STUDENT = 'Ana Pérez Soto · Ingeniería en Computación · Casa central'

export const MY_REQUESTS = [
  { id: 'SOL-2026-0418', dateLabel: '12 de mayo', reason: 'Dificultad para organizar la carga académica', status: { label: 'Cerrada', tone: 'neutral' } },
  { id: 'SOL-2026-0631', dateLabel: '28 de julio', reason: 'Orientación sobre beneficios estudiantiles', status: { label: 'En seguimiento', tone: 'success' } },
]

export const URGENCY_OPTIONS = [
  { value: 'low', label: 'Baja, puedo esperar unos días' },
  { value: 'medium', label: 'Media, me gustaría respuesta esta semana' },
  { value: 'high', label: 'Alta, necesito hablar con alguien pronto' },
]

export const CONTACT_CHANNELS = [
  { value: 'email', label: 'Correo institucional' },
  { value: 'phone', label: 'Llamada telefónica' },
  { value: 'in-person', label: 'Presencial en la sede' },
]

export const CONTACT_TIMES = [
  { value: 'any', label: 'Cualquier horario' },
  { value: 'morning', label: 'Mañana, entre 9 y 13 horas' },
  { value: 'afternoon', label: 'Tarde, entre 14 y 18 horas' },
]

export const NEXT_STEPS = [
  'Recibes un folio y un correo de confirmación de inmediato.',
  'Un consejero revisa y clasifica tu caso dentro de 24 horas hábiles.',
  'Se te asigna un profesional dentro de 48 horas hábiles.',
  'Te contactamos por la vía que elegiste para coordinar la primera atención.',
  'Puedes seguir el estado de tu caso desde esta misma pantalla.',
]
