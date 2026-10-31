import { findActiveSession, updateLastActivity } from '../services/session.service.js'
import { verifyToken } from '../utils/token.js'

const INVALID_SESSION = 'Sesión inválida o expirada'

// Verifica que haya una sesión válida (401 si no).
// Deja { id, role } en req.user y el id de la sesión en req.tokenId (lo usa el logout).
export async function requireAuth(req, res, next) {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Debes iniciar sesión' })
  }

  let payload
  try {
    payload = verifyToken(token)
  } catch {
    return res.status(401).json({ message: INVALID_SESSION })
  }

  if (!payload.tokenId) {
    return res.status(401).json({ message: INVALID_SESSION })
  }

  // Si no hay sesión, el usuario cerró sesión o pasó el tiempo de inactividad
  const session = await findActiveSession(payload.tokenId, payload.id)
  if (!session) {
    return res.status(401).json({ message: INVALID_SESSION })
  }

  await updateLastActivity(session)

  req.user = { id: payload.id, role: payload.role }
  req.tokenId = payload.tokenId

  next()
}

// Restringe la ruta a ciertos perfiles (403 si no).
export function allowRoles(...roles) {
  return (req, res, next) => {
    // Por si se olvidó poner requireAuth antes
    if (!req.user) {
      return res.status(401).json({ message: 'Debes iniciar sesión' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' })
    }

    next()
  }
}
