import {
  REQUEST_ORIGINS,
  REQUEST_STATUSES,
  URGENCY_LEVELS,
  WORKSHOP_STATUSES,
} from '../config/constants.js'
import { Enrollment, SupportRequest, Workshop } from '../models/index.js'

// Los reportes son agregados: solo cuentan y promedian.
// Nunca devuelven nombres, correos, códigos de solicitud ni ids de estudiantes.

const HOUR = 60 * 60 * 1000

// Cuenta cuántos elementos hay de cada valor. Parte en 0 para los valores conocidos
function countBy(items, keyOf, knownKeys = []) {
  const counts = Object.fromEntries(knownKeys.map((key) => [key, 0]))
  for (const item of items) {
    const key = keyOf(item) ?? 'sin_dato'
    counts[key] = (counts[key] ?? 0) + 1
  }
  return counts
}

// Convierte { clave: total } en una lista ordenada de mayor a menor
const toList = (counts, label) =>
  Object.entries(counts)
    .map(([key, count]) => ({ [label]: key, count }))
    .sort((a, b) => b.count - a.count)

// Primera vez que la solicitud llegó a un estado
function firstChange(request, status) {
  return request.statusHistory.find((change) => change.status === status)?.changedAt
}

// Promedio en horas entre la recepción y un estado, con un decimal
function averageHours(requests, status) {
  const durations = requests
    .map((request) => {
      const reachedAt = firstChange(request, status)
      return reachedAt ? new Date(reachedAt) - new Date(request.createdAt) : null
    })
    .filter((duration) => duration !== null)

  if (durations.length === 0) return { averageHours: null, cases: 0 }

  const average = durations.reduce((sum, duration) => sum + duration, 0) / durations.length
  return { averageHours: Math.round((average / HOUR) * 10) / 10, cases: durations.length }
}

function dateFilter(field, from, to) {
  if (!from && !to) return {}
  const range = {}
  if (from) range.$gte = from
  // "to" llega como el inicio del día (00:00); se usa "< día siguiente" para incluir el día completo
  if (to) range.$lt = new Date(to.getTime() + 24 * 60 * 60 * 1000)
  return { [field]: range }
}

async function workshopParticipation({ from, to, campus }) {
  const workshops = await Workshop.find({
    ...dateFilter('startsAt', from, to),
    ...(campus ? { campus } : {}),
  })
  const enrollments = await Enrollment.find({
    workshop: { $in: workshops.map((workshop) => workshop._id) },
  })

  const byStatus = countBy(enrollments, (enrollment) => enrollment.status, [
    'enrolled',
    'attended',
    'cancelled',
  ])
  const active = byStatus.enrolled + byStatus.attended

  return {
    workshops: workshops.length,
    byStatus: countBy(workshops, (workshop) => workshop.status, WORKSHOP_STATUSES),
    enrollments: byStatus,
    // Porcentaje de inscritos (no cancelados) que asistieron
    attendanceRate: active > 0 ? Math.round((byStatus.attended / active) * 100) : null,
  }
}

export async function getSummary({ from, to, campus }) {
  const requests = await SupportRequest.find({
    ...dateFilter('createdAt', from, to),
    ...(campus ? { campus } : {}),
  }).populate('type campus')

  return {
    period: { from: from ?? null, to: to ?? null, campus: campus ?? null },
    totalRequests: requests.length,
    byStatus: countBy(requests, (request) => request.status, REQUEST_STATUSES),
    byOrigin: countBy(requests, (request) => request.origin, REQUEST_ORIGINS),
    byUrgency: countBy(requests, (request) => request.perceivedUrgency, URGENCY_LEVELS),
    byType: toList(
      countBy(requests, (request) => request.type?.name),
      'type',
    ),
    byCampus: toList(
      countBy(requests, (request) => request.campus?.name),
      'campus',
    ),
    byMonth: Object.entries(
      countBy(requests, (request) => new Date(request.createdAt).toISOString().slice(0, 7)),
    )
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month)),
    responseTimes: {
      toAssignment: averageHours(requests, 'assigned'),
      toClosure: averageHours(requests, 'closed'),
    },
    workshops: await workshopParticipation({ from, to, campus }),
  }
}
