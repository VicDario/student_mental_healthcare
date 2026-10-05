const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const MONTHS_LONG = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]
const WEEKDAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const pad = (value) => String(value).padStart(2, '0')

function parseIso(iso) {
  const [date, time = ''] = iso.split('T')
  const [year, month, day] = date.split('-').map(Number)
  return { year, month, day, time }
}

export function formatShortDate(iso) {
  const { year, month, day } = parseIso(iso)
  return `${day} ${MONTHS_SHORT[month - 1]} ${year}`
}

export function formatDayMonth(iso) {
  const { month, day } = parseIso(iso)
  return `${day} de ${MONTHS_LONG[month - 1]}`
}

export function formatDateTime(iso) {
  const { year, month, day, time } = parseIso(iso)
  return `${pad(day)} ${MONTHS_SHORT[month - 1]} ${year}, ${time.slice(0, 5)}`
}

export function formatLongDateTime(iso) {
  const { year, month, day, time } = parseIso(iso)
  const weekday = WEEKDAYS[new Date(year, month - 1, day).getDay()]
  return `${weekday} ${day} de ${MONTHS_LONG[month - 1]} de ${year}, ${time}`
}
