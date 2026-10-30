import bcrypt from 'bcryptjs'
import { User } from '../models/index.js'
import { HttpError } from '../utils/httpError.js'
import { createToken } from '../utils/token.js'
import { createSession, deleteSession } from './session.service.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6
const BCRYPT_SALT_ROUNDS = 10
const INVALID_CREDENTIALS = 'Correo o contraseña incorrectos'

function normalizeEmail(email) {
  return String(email).toLowerCase().trim()
}

function toPublicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

// El registro público solo crea estudiantes; los demás perfiles los crea un administrador
export async function register({ name, email, password, studentCode, program, phone }) {
  if (!name || !email || !password) {
    throw new HttpError(400, 'El nombre, el correo y la contraseña son obligatorios')
  }

  const normalizedEmail = normalizeEmail(email)
  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    throw new HttpError(400, 'El correo no es válido')
  }

  if (String(password).length < MIN_PASSWORD_LENGTH) {
    throw new HttpError(400, `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`)
  }

  const emailTaken = await User.exists({ email: normalizedEmail })
  if (emailTaken) {
    throw new HttpError(409, 'El correo ya está registrado')
  }

  const passwordHash = await bcrypt.hash(String(password), BCRYPT_SALT_ROUNDS)
  const user = await User.create({
    name,
    email: normalizedEmail,
    passwordHash,
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

  const normalizedEmail = normalizeEmail(email)
  const user = await User.findOne({ email: normalizedEmail, active: true }).select('+passwordHash')

  // Mismo mensaje en ambos casos para no revelar qué correos existen
  if (!user) {
    throw new HttpError(401, INVALID_CREDENTIALS)
  }

  const validPassword = await bcrypt.compare(String(password), user.passwordHash)
  if (!validPassword) {
    throw new HttpError(401, INVALID_CREDENTIALS)
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
