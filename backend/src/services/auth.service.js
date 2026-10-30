import bcrypt from 'bcryptjs'
import { User } from '../models/index.js'
import { HttpError } from '../utils/httpError.js'
import { createToken } from '../utils/token.js'
import { createSession, deleteSession } from './session.service.js'

const BCRYPT_SALT_ROUNDS = 10
const INVALID_CREDENTIALS = 'Correo o contraseña incorrectos'

function toPublicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

// Los datos llegan validados por registerSchema y loginSchema (schemas/auth.schemas.js)

// El registro público solo crea estudiantes; los demás perfiles los crea un administrador
export async function register({ name, email, password, studentCode, program, phone }) {
  const emailTaken = await User.exists({ email })
  if (emailTaken) {
    throw new HttpError(409, 'El correo ya está registrado')
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: 'student',
    studentCode,
    program,
    phone,
  })

  return toPublicUser(user)
}

export async function login({ email, password }) {
  const user = await User.findOne({ email, active: true }).select('+passwordHash')

  // Mismo mensaje en ambos casos para no revelar qué correos existen
  if (!user) {
    throw new HttpError(401, INVALID_CREDENTIALS)
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash)
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
