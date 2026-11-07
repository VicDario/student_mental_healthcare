import { Appointment, Catalog, SupportRequest, User } from '../models/index.js'
import { HttpError } from '../utils/httpError.js'
import { findAccessibleRequest } from './access.service.js'
import { recordAudit } from './audit.service.js'
import { notify } from './notification.service.js'
import { nextRequestCode, toPublicRequest } from './request.service.js'

// Perfiles que pueden atender casos
export const STAFF_ROLES = ['professional', 'counselor']

async function findRequestOrFail(id) {
  const request = await SupportRequest.findById(id)
  if (!request) {
    throw new HttpError(404, 'Solicitud no encontrada')
  }
  return request
}

// Un caso cerrado no admite más cambios
export function ensureOpen(request) {
  if (request.status === 'closed') {
    throw new HttpError(400, 'La solicitud está cerrada y no admite cambios')
  }
}

// Cambia el estado y deja registro de quién y cuándo en el historial
export function changeStatus(request, status, userId) {
  request.status = status
  request.statusHistory.push({ status, changedBy: userId })
}

// Error 400 que indica el campo, con el formato de la #26
export function fieldError(field, message) {
  return new HttpError(400, message, [{ field, message }])
}

// El consejero define el tipo de apoyo y la prioridad (#18).
// Se puede corregir mientras la solicitud no esté asignada.
export async function classifyRequest(id, { type, priority }, actor) {
  const request = await findRequestOrFail(id)
  ensureOpen(request)

  if (!['received', 'classified'].includes(request.status)) {
    throw new HttpError(400, 'La solicitud ya fue asignada y no se puede volver a clasificar')
  }

  const typeExists = await Catalog.exists({ _id: type, type: 'support_type', active: true })
  if (!typeExists) {
    throw fieldError('type', 'El tipo de apoyo no existe o está desactivado')
  }

  request.type = type
  request.priority = priority
  changeStatus(request, 'classified', actor.id)
  await request.save()

  await recordAudit(actor, {
    action: 'classify',
    entity: 'SupportRequest',
    entityId: request._id,
    changedFields: ['type', 'priority', 'status'],
  })
  await notify({ user: request.student, type: 'status_changed', request, status: 'classified' })

  await request.populate('student type campus assignedTo')
  return toPublicRequest(request)
}

// El consejero o el administrador asigna la solicitud a un profesional (#19).
// Primero debe estar clasificada. Si ya está en atención, se puede reasignar sin cambiar el estado.
export async function assignRequest(id, { assignedTo }, actor) {
  const request = await findRequestOrFail(id)
  ensureOpen(request)

  if (request.status === 'received') {
    throw new HttpError(400, 'Primero debes clasificar la solicitud')
  }

  const staffExists = await User.exists({
    _id: assignedTo,
    role: { $in: STAFF_ROLES },
    active: true,
  })
  if (!staffExists) {
    throw fieldError('assignedTo', 'El profesional no existe, no está activo o no atiende casos')
  }

  request.assignedTo = assignedTo
  if (request.status !== 'in_progress') {
    changeStatus(request, 'assigned', actor.id)
  }
  await request.save()

  await recordAudit(actor, {
    action: 'assign',
    entity: 'SupportRequest',
    entityId: request._id,
    changedFields: ['assignedTo', 'status'],
  })
  await notify({ user: request.student, type: 'assigned', request })

  await request.populate('student type campus assignedTo')
  return toPublicRequest(request)
}

// Cierra el caso con su motivo y la derivación realizada (#21).
// Solo el profesional asignado (findAccessibleRequest) o un consejero.
// Las citas que seguían agendadas se cancelan, porque el caso ya no admite cambios.
export async function closeRequest(id, { reason, referralType, referralDestination }, user, actor) {
  const request = await findAccessibleRequest(user, id)
  if (request.status === 'closed') {
    throw new HttpError(400, 'La solicitud ya está cerrada')
  }

  request.closure = {
    reason,
    referralType,
    referralDestination: referralType === 'none' ? undefined : referralDestination,
    closedBy: actor.id,
  }
  changeStatus(request, 'closed', actor.id)
  await request.save()

  const pending = await Appointment.find({ request: request._id, status: 'scheduled' })
  for (const appointment of pending) {
    appointment.status = 'cancelled'
    await appointment.save()
  }

  await recordAudit(actor, {
    action: 'close',
    entity: 'SupportRequest',
    entityId: request._id,
    changedFields: ['status', 'closure'],
  })
  await notify({ user: request.student, type: 'status_changed', request, status: 'closed' })

  await request.populate('student type campus assignedTo')
  const { closure } = request
  return {
    ...toPublicRequest(request),
    closure: {
      reason: closure.reason,
      referralType: closure.referralType,
      referralDestination: closure.referralDestination ?? null,
      closedBy: closure.closedBy,
      closedAt: closure.closedAt,
    },
  }
}

// El docente deriva a un estudiante (#17). Se crea una solicitud con origen "referral"
// y el estudiante recibe un aviso respetuoso. El docente solo verá sus derivaciones
// (requestScope) y nunca las observaciones de seguimiento.
export async function createReferral(data, actor) {
  const { studentEmail, course, observedSituation, studentInformed, perceivedUrgency } = data

  const student = await User.findOne({ email: studentEmail, role: 'student', active: true })
  if (!student) {
    throw fieldError('studentEmail', 'No encontramos a un estudiante activo con ese correo')
  }

  const request = await SupportRequest.create({
    code: await nextRequestCode(),
    student: student._id,
    origin: 'referral',
    referral: { teacher: actor.id, course, observedSituation, studentInformed },
    reason: 'Derivación docente',
    description: observedSituation,
    perceivedUrgency,
    contact: { channel: 'email', value: student.email },
    campus: student.campus,
    status: 'received',
    statusHistory: [{ status: 'received', changedBy: actor.id }],
  })

  await recordAudit(actor, {
    action: 'create',
    entity: 'SupportRequest',
    entityId: request._id,
    changedFields: ['referral', 'perceivedUrgency'],
  })
  await notify({ user: student._id, type: 'received', request })

  await request.populate('student campus')
  return {
    ...toPublicRequest(request),
    referral: { course: course ?? null, observedSituation, studentInformed },
  }
}
