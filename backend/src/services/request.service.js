import { Catalog, SupportRequest, User } from '../models/index.js'
import { HttpError } from '../utils/httpError.js'
import { findAccessibleRequest, requestScope } from './access.service.js'
import { recordAudit } from './audit.service.js'

// Id y nombre de un documento relacionado (sede, tipo, usuario), o null si no hay
function toRef(doc) {
  return doc ? { id: doc.id, name: doc.name } : null
}

// Datos resumidos para el listado (sin descripción ni contacto)
function toRequestSummary(request) {
  return {
    id: request.id,
    code: request.code,
    origin: request.origin,
    reason: request.reason,
    perceivedUrgency: request.perceivedUrgency,
    priority: request.priority,
    status: request.status,
    createdAt: request.createdAt,
  }
}

// Detalle de una solicitud. Las observaciones de seguimiento nunca se incluyen aquí.
function toPublicRequest(request) {
  return {
    ...toRequestSummary(request),
    student: toRef(request.student),
    description: request.description,
    contact: { channel: request.contact.channel, value: request.contact.value },
    type: toRef(request.type),
    campus: toRef(request.campus),
    assignedTo: toRef(request.assignedTo),
    statusHistory: request.statusHistory.map(({ status, changedBy, changedAt }) => ({
      status,
      changedBy,
      changedAt,
    })),
  }
}

// Genera el siguiente código del año: SOL-2026-0001, SOL-2026-0002, ...
// Busca el último código del año y le suma 1, así la numeración parte de nuevo cada año.
// El índice único de code impide que se guarden dos solicitudes con el mismo código.
async function nextRequestCode() {
  const prefix = `SOL-${new Date().getFullYear()}-`
  const last = await SupportRequest.findOne({ code: { $regex: `^${prefix}` } }).sort({ code: -1 })
  const lastNumber = last ? Number(last.code.slice(prefix.length)) : 0
  return `${prefix}${String(lastNumber + 1).padStart(4, '0')}`
}

// Sede de la solicitud: la indicada (si existe y está activa) o la de la cuenta del estudiante
async function resolveCampus(campusId, studentId) {
  if (!campusId) {
    const student = await User.findById(studentId).select('campus')
    return student?.campus
  }

  const exists = await Catalog.exists({ _id: campusId, type: 'campus', active: true })
  if (!exists) {
    throw new HttpError(400, 'La sede no existe o está desactivada')
  }
  return campusId
}

// Los datos llegan validados por schemas/request.schemas.js.
// actor: quién hace la acción, para la bitácora

// El estudiante crea su propia solicitud, que parte en estado "received"
export async function createRequest({ campus, ...data }, actor) {
  const request = await SupportRequest.create({
    ...data,
    code: await nextRequestCode(),
    student: actor.id,
    origin: 'self',
    campus: await resolveCampus(campus, actor.id),
    status: 'received',
    statusHistory: [{ status: 'received', changedBy: actor.id }],
  })

  await recordAudit(actor, {
    action: 'create',
    entity: 'SupportRequest',
    entityId: request._id,
    changedFields: Object.keys(data),
  })

  // La notificación al estudiante se agrega cuando se integre el PR #35 (notify)

  await request.populate('student campus')
  return toPublicRequest(request)
}

// Cada perfil solo ve las solicitudes a su alcance (ver access.service.js)
export async function listRequests(user, { status }) {
  const filter = {}
  if (status) filter.status = status

  const requests = await SupportRequest.find({ ...filter, ...requestScope(user) }).sort({
    createdAt: -1,
  })
  return requests.map(toRequestSummary)
}

// Si quien ve el detalle no es el estudiante, el acceso queda en la bitácora
export async function getRequest(user, id, actor) {
  const request = await findAccessibleRequest(user, id)
  await request.populate('student type campus assignedTo')

  if (user.role !== 'student') {
    await recordAudit(actor, { action: 'view', entity: 'SupportRequest', entityId: request._id })
  }

  return toPublicRequest(request)
}
