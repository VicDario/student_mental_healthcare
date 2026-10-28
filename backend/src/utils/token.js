import jwt from 'jsonwebtoken'

export function createToken({ id, role }) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
  })
}

export function verifyToken(token) {
  const { id, role } = jwt.verify(token, process.env.JWT_SECRET)
  return { id, role }
}
