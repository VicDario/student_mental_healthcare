import { FollowUp } from '../models/index.js'
import { HttpError } from '../utils/httpError.js'
import { findAccessibleRequest, findFollowUps } from './access.service.js'
import { recordAudit } from './audit.service.js'
import { notify } from './notification.service.js'
import { changeStatus, ensureOpen } from './requestFlow.service.js'

function toPublicFollowUp(followUp) {
  return {
    id: followUp.id,
    text: followUp.text,
    author: followUp.author ? { id: followUp.author.id, name: followUp.author.name } : null,
    createdAt: followUp.createdAt,
  }
}

// Observaciones de una solicitud. Estudiantes y docentes reciben 403 (findFollowUps).
// Leerlas queda en la bitácora, porque son datos sensibles.
export async function listFollowUps(user, requestId, actor) {
  const followUps = await findFollowUps(user, requestId)
  for (const followUp of followUps) await followUp.populate('author')

  await recordAudit(actor, {
    action: 'view',
    entity: 'FollowUp',
    entityId: requestId,
  })

  return followUps.map(toPublicFollowUp)
}

// El profesional asignado (o un consejero) registra una observación.
// La primera observación deja la solicitud "en atención" (in_progress).
export async function createFollowUp(requestId, { text }, user, actor) {
  const request = await findAccessibleRequest(user, requestId)
  ensureOpen(request)

  if (!['assigned', 'in_progress'].includes(request.status)) {
    throw new HttpError(400, 'La solicitud debe estar asignada a un profesional')
  }

  const followUp = await FollowUp.create({ request: request._id, author: actor.id, text })

  if (request.status === 'assigned') {
    changeStatus(request, 'in_progress', actor.id)
    await request.save()
    await notify({ user: request.student, type: 'status_changed', request, status: 'in_progress' })
  }

  // En la bitácora va el nombre del campo, nunca el texto de la observación
  await recordAudit(actor, {
    action: 'create',
    entity: 'FollowUp',
    entityId: followUp._id,
    changedFields: ['text'],
  })

  await followUp.populate('author')
  return toPublicFollowUp(followUp)
}
