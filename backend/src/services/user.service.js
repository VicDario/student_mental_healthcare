import bcrypt from 'bcryptjs'
import { Catalog, User } from '../models/index.js'
import { HttpError } from '../utils/httpError.js'
import { deleteUserSessions } from './session.service.js'

const BCRYPT_SALT_ROUNDS = 10
const USER_NOT_FOUND = 'Usuario no encontrado'

// Datos que el administrador ve de cada cuenta (nunca la contraseña)
function toAdminUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    campus: user.campus ? { id: user.campus.id, name: user.campus.name } : null,
    unit: user.unit ? { id: user.unit.id, name: user.unit.name } : null,
    studentCode: user.studentCode,
    program: user.program,
    phone: user.phone,
    active: user.active,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  }
}

// Escapa caracteres especiales para usar el texto de búsqueda en una expresión regular
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// La sede y la unidad deben existir en el catálogo, ser del tipo correcto y estar activas
async function ensureCatalogItem(id, type, label) {
  if (!id) return

  const exists = await Catalog.exists({ _id: id, type, active: true })
  if (!exists) {
    throw new HttpError(400, `${label} no existe o está desactivada`)
  }
}

async function ensureEmailAvailable(email, exceptUserId) {
  const filter = { email }
  if (exceptUserId) filter._id = { $ne: exceptUserId }

  const taken = await User.exists(filter)
  if (taken) {
    throw new HttpError(409, 'El correo ya está registrado')
  }
}

async function findUserOrFail(id) {
  const user = await User.findById(id).populate('campus unit')
  if (!user) {
    throw new HttpError(404, USER_NOT_FOUND)
  }
  return user
}

// Los datos llegan validados por los esquemas de schemas/user.schemas.js

export async function listUsers({ role, active, search }) {
  const filter = {}

  if (role) filter.role = role
  if (active) filter.active = active === 'true'
  if (search) {
    const pattern = new RegExp(escapeRegex(search), 'i')
    filter.$or = [{ name: pattern }, { email: pattern }]
  }

  const users = await User.find(filter).populate('campus unit').sort({ name: 1 })
  return users.map(toAdminUser)
}

export async function createUser({ password, ...data }) {
  await ensureEmailAvailable(data.email)
  await ensureCatalogItem(data.campus, 'campus', 'La sede')
  await ensureCatalogItem(data.unit, 'unit', 'La unidad de apoyo')

  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
  const user = await User.create({ ...data, passwordHash })
  await user.populate('campus unit')

  return toAdminUser(user)
}

export async function updateUser(id, data) {
  const user = await findUserOrFail(id)

  if (data.email) await ensureEmailAvailable(data.email, user._id)
  await ensureCatalogItem(data.campus, 'campus', 'La sede')
  await ensureCatalogItem(data.unit, 'unit', 'La unidad de apoyo')

  user.set(data)
  await user.save()
  await user.populate('campus unit')

  return toAdminUser(user)
}

// Los usuarios nunca se eliminan: se desactivan y se cierran todas sus sesiones
export async function deactivateUser(id, adminId) {
  if (id === adminId) {
    throw new HttpError(400, 'No puedes desactivar tu propia cuenta')
  }

  const user = await findUserOrFail(id)

  user.active = false
  await user.save()
  await deleteUserSessions(user._id)

  return toAdminUser(user)
}

export async function activateUser(id) {
  const user = await findUserOrFail(id)

  user.active = true
  await user.save()

  return toAdminUser(user)
}
