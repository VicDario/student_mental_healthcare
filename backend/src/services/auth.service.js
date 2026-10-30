import bcrypt from 'bcryptjs'
import { User } from '../models/index.js'
import { HttpError } from '../utils/httpError.js'
import { createToken } from '../utils/token.js'
import { createSession, deleteSession } from './session.service.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6

function toPublicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

// El registro público solo crea estudiantes; los demás perfiles los crea un administrador
export async function register({ name, email, password, studentCode, program, phone }) {
  if (!name || !email || !password) {
    throw new HttpError(400, 'El nombre, el correo y la contraseña son obligatorios')
  }

  if (!EMAIL_PATTERN.test(String(email))) {
    throw new HttpError(400, 'El correo no es válido')
  }

  if (String(password).length < MIN_PASSWORD_LENGTH) {
    throw new HttpError(400, `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`)
  }

  const normalizedEmail = String(email).toLowerCase().trim()
  if (await User.exists({ email: normalizedEmail })) {
    throw new HttpError(409, 'El correo ya está registrado')
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    passwordHash: await bcrypt.hash(String(password), 10),
    role: 'student',
    studentCode,
    program,
    phone,
  })

  return toPublicUser(user)
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

  const tokenId = await createSession(user.id)
  const token = createToken(user, tokenId)

  user.lastLoginAt = new Date()
  await user.save()

  return { token, user: toPublicUser(user) }
}

export async function logout(tokenId) {
  await deleteSession(tokenId)
}

export async function getProfile(userId) {
  const user = await User.findOne({ _id: userId, active: true })

  if (!user) {
    throw new HttpError(404, 'Usuario no encontrado')
  }

  return toPublicUser(user)
}
