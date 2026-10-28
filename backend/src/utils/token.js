import jwt from 'jsonwebtoken'

// jsonwebtoken lee "7200" como milisegundos; un número puro se interpreta como segundos
function getExpiresIn() {
  const value = process.env.JWT_EXPIRES_IN || '2h'
  return /^\d+$/.test(value) ? Number(value) : value
}

export function createToken({ id, role }) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: getExpiresIn() })
}

export function verifyToken(token) {
  const { id, role } = jwt.verify(token, process.env.JWT_SECRET)
  return { id, role }
}
