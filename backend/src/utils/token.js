import jwt from 'jsonwebtoken'

// jsonwebtoken lee "7200" como milisegundos; un número puro se interpreta como segundos
function getExpiresIn() {
  const value = process.env.JWT_EXPIRES_IN || '2h'
  return /^\d+$/.test(value) ? Number(value) : value
}

// tokenId (jti) identifica la sesión guardada en la colección sessions
export function createToken({ id, role }, tokenId) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: getExpiresIn(),
    jwtid: tokenId,
  })
}

export function verifyToken(token) {
  const { id, role, jti } = jwt.verify(token, process.env.JWT_SECRET)
  return { id, role, tokenId: jti }
}
