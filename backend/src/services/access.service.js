import { FollowUp, SupportRequest } from '../models/index.js'
import { HttpError } from '../utils/httpError.js'

// Perfiles que pueden ver y registrar observaciones de seguimiento.
// Estudiantes y docentes nunca las reciben.
export const FOLLOW_UP_ROLES = ['professional', 'counselor', 'admin']

// Filtro de Mongo con las solicitudes que el usuario puede ver.
// Va siempre al final al combinarlo: find({ ...filtros, ...requestScope(user) })
export function requestScope(user) {
  switch (user.role) {
    case 'student':
      return { student: user.id }
    case 'teacher':
      return { origin: 'referral', 'referral.teacher': user.id }
    case 'professional':
      return { assignedTo: user.id }
    case 'counselor':
    case 'admin':
      return {}
    default:
      throw new HttpError(403, 'No tienes permiso para realizar esta acción')
  }
}

// Busca una solicitud solo si está dentro del alcance del usuario.
// Responde 404 y no 403 para no revelar que la solicitud existe.
export async function findAccessibleRequest(user, requestId) {
  const request = await SupportRequest.findOne({
    _id: requestId,
    ...requestScope(user),
  })

  if (!request) {
    throw new HttpError(404, 'Solicitud no encontrada')
  }

  return request
}

// Única forma de leer observaciones de seguimiento.
// Estudiantes y docentes reciben 403; el resto solo ve las de solicitudes a su alcance.
export async function findFollowUps(user, requestId) {
  if (!FOLLOW_UP_ROLES.includes(user.role)) {
    throw new HttpError(403, 'No tienes permiso para realizar esta acción')
  }

  const request = await findAccessibleRequest(user, requestId)

  return FollowUp.find({ request: request._id }).sort({ createdAt: 1 })
}
