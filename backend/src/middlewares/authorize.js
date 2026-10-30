import { touchSession } from '../services/session.service.js'
import { verifyToken } from '../utils/token.js'

// Sin roles permite a cualquier usuario autenticado. Deja { id, role } en req.user.
export function authorize(...allowedRoles) {
  return async (req, res, next) => {
    const [scheme, token] = (req.headers.authorization ?? '').split(' ')

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Debes iniciar sesión' })
    }

    let payload
    try {
      payload = verifyToken(token)
    } catch {
      return res.status(401).json({ message: 'Sesión inválida o expirada' })
    }

    // La sesión debe existir y tener actividad reciente; si no, cerró sesión o expiró
    const active = payload.tokenId && (await touchSession(payload.tokenId, payload.id))
    if (!active) {
      return res.status(401).json({ message: 'Sesión inválida o expirada' })
    }

    req.user = { id: payload.id, role: payload.role }
    req.tokenId = payload.tokenId

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' })
    }

    next()
  }
}
