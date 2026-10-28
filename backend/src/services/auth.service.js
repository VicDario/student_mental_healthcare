import bcrypt from 'bcryptjs'
import { User } from '../models/index.js'
import { HttpError } from '../utils/httpError.js'
import { createToken } from '../utils/token.js'

function toPublicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

export async function login({ email, password }) {
  if (!email || !password) {
    throw new HttpError(400, 'El correo y la contraseña son obligatorios')
  }

  const user = await User.findOne({ email: String(email).toLowerCase(), active: true }).select(
    '+passwordHash',
  )
  const validPassword = user && (await bcrypt.compare(String(password), user.passwordHash))

  // Mismo mensaje en ambos casos para no revelar qué correos existen
  if (!validPassword) {
    throw new HttpError(401, 'Correo o contraseña incorrectos')
  }

  user.lastLoginAt = new Date()
  await user.save()

  return { token: createToken(user), user: toPublicUser(user) }
}

export async function getProfile(userId) {
  const user = await User.findOne({ _id: userId, active: true })

  if (!user) {
    throw new HttpError(404, 'Usuario no encontrado')
  }

  return toPublicUser(user)
}
