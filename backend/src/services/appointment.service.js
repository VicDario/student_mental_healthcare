import { Appointment } from '../models/index.js'
import { HttpError } from '../utils/httpError.js'
import { findAccessibleRequest } from './access.service.js'
import { recordAudit } from './audit.service.js'
import { notify } from './notification.service.js'
import { ensureOpen, fieldError } from './requestFlow.service.js'

// Datos de una cita. Nunca incluye el motivo ni las observaciones del caso
function toPublicAppointment(appointment) {
  const ref = (doc) => (doc ? { id: doc.id, name: doc.name } : null)

  return {
    id: appointment.id,
    request: appointment.request
      ? { id: appointment.request.id, code: appointment.request.code }
      : null,
    student: ref(appointment.student),
    professional: ref(appointment.professional),
    startsAt: appointment.startsAt,
    durationMinutes: appointment.durationMinutes,
    modality: appointment.modality,
    location: appointment.location ?? null,
    status: appointment.status,
    createdAt: appointment.createdAt,
  }
}

// Qué citas ve cada perfil: el estudiante las suyas, el profesional las que atiende,
// el consejero y el administrador todas. El docente no ve citas.
function appointmentScope(user) {
  switch (user.role) {
    case 'student':
      return { student: user.id }
    case 'professional':
      return { professional: user.id }
    case 'counselor':
    case 'admin':
      return {}
    default:
      throw new HttpError(403, 'No tienes permiso para realizar esta acción')
  }
}

const POPULATE = 'request student professional'

// El profesional asignado (o un consejero) agenda una cita para una solicitud en atención.
// La cita queda a cargo del profesional asignado a la solicitud.
export async function createAppointment(data, user, actor) {
  const request = await findAccessibleRequest(user, data.request)
  ensureOpen(request)

  if (!['assigned', 'in_progress'].includes(request.status) || !request.assignedTo) {
    throw new HttpError(400, 'La solicitud debe estar asignada a un profesional para agendar citas')
  }
  if (data.startsAt <= new Date()) {
    throw fieldError('startsAt', 'La cita debe ser en una fecha futura')
  }

  const appointment = await Appointment.create({
    ...data,
    request: request._id,
    student: request.student,
    professional: request.assignedTo,
  })

  await recordAudit(actor, {
    action: 'create',
    entity: 'Appointment',
    entityId: appointment._id,
    changedFields: Object.keys(data),
  })
  await notify({ user: request.student, type: 'appointment', request })

  await appointment.populate(POPULATE)
  return toPublicAppointment(appointment)
}

// Citas a su alcance, de la más próxima a la más lejana
export async function listAppointments(user, { status, request }) {
  const filter = {}
  if (status) filter.status = status
  if (request) filter.request = request

  const appointments = await Appointment.find({ ...filter, ...appointmentScope(user) })
    .populate(POPULATE)
    .sort({ startsAt: 1 })

  return appointments.map(toPublicAppointment)
}

// Marca la cita como realizada, cancelada o inasistencia.
// Solo el profesional de la cita o un consejero, y solo si sigue agendada.
export async function updateAppointmentStatus(id, { status }, user, actor) {
  const appointment = await Appointment.findOne({ _id: id, ...appointmentScope(user) })
  if (!appointment) {
    throw new HttpError(404, 'Cita no encontrada')
  }
  if (appointment.status !== 'scheduled') {
    throw new HttpError(400, 'Solo se puede cambiar el estado de una cita agendada')
  }

  appointment.status = status
  await appointment.save()

  await recordAudit(actor, {
    action: 'update',
    entity: 'Appointment',
    entityId: appointment._id,
    changedFields: ['status'],
  })

  await appointment.populate(POPULATE)
  return toPublicAppointment(appointment)
}
