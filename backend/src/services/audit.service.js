import { AuditLog } from '../models/index.js'

// Quién hace la acción y desde qué IP
export function auditActor(req) {
  return { id: req.user?.id, role: req.user?.role, ip: req.ip }
}

// Guarda una acción en la bitácora
export async function recordAudit(actor, { action, entity, entityId, changedFields = [] }) {
  await AuditLog.create({
    user: actor.id,
    role: actor.role,
    action,
    entity,
    entityId,
    changedFields,
    ip: actor.ip,
  })
}

// Campos que nunca se registran
const HIDDEN_FIELDS = ['passwordHash', 'updatedAt', 'lastLoginAt']

// Nombres (no valores) de los campos que cambiaron. Usar antes de save()
export function changedFieldsOf(doc) {
  return doc
    .modifiedPaths({ includeChildren: false })
    .filter((path) => !path.includes('.') && !HIDDEN_FIELDS.includes(path))
}

// Filtros validados por listAuditLogsQuerySchema
export async function listAuditLogs({ entityId, user, action, limit }) {
  const filter = {}

  if (entityId) filter.entityId = entityId
  if (user) filter.user = user
  if (action) filter.action = action

  const logs = await AuditLog.find(filter)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit)

  return logs.map((log) => ({
    id: log.id,
    user: log.user ? { id: log.user.id, name: log.user.name, email: log.user.email } : null,
    role: log.role,
    action: log.action,
    entity: log.entity,
    entityId: log.entityId,
    changedFields: log.changedFields,
    ip: log.ip,
    createdAt: log.createdAt,
  }))
}
