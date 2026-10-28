import { verifyToken } from '../utils/token.js'

// Sin roles permite a cualquier usuario autenticado. Deja { id, role } en req.user.
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    const [scheme, token] = (req.headers.authorization ?? '').split(' ')

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Debes iniciar sesión' })
    }

    try {
      req.user = verifyToken(token)
    } catch {
      return res.status(401).json({ message: 'Sesión inválida o expirada' })
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' })
    }

    next()
  }
}
