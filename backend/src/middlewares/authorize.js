import { findActiveSession, updateLastActivity } from '../services/session.service.js'
import { verifyToken } from '../utils/token.js'

const INVALID_SESSION = 'Sesión inválida o expirada'

// Sin roles permite a cualquier usuario autenticado.
// Deja { id, role } en req.user y el id de la sesión en req.tokenId (lo usa el logout).
export function authorize(...allowedRoles) {
  return async (req, res, next) => {
    const [scheme, token] = (req.headers.authorization ?? '').split(' ')

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Debes iniciar sesión', errors: [] })
    }

    let payload
    try {
      payload = verifyToken(token)
    } catch {
      return res.status(401).json({ message: INVALID_SESSION, errors: [] })
    }

    if (!payload.tokenId) {
      return res.status(401).json({ message: INVALID_SESSION, errors: [] })
    }

    // Si no hay sesión, el usuario cerró sesión o pasó el tiempo de inactividad
    const session = await findActiveSession(payload.tokenId, payload.id)
    if (!session) {
      return res.status(401).json({ message: INVALID_SESSION, errors: [] })
    }

    await updateLastActivity(session)

    req.user = { id: payload.id, role: payload.role }
    req.tokenId = payload.tokenId

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción', errors: [] })
    }

    next()
  }
}
