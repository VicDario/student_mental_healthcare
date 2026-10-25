// Crea colecciones e índices y carga datos de prueba. Borra los datos existentes.
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { connectDB } from './config/db.js'
import * as models from './models/index.js'

const { Catalog, User } = models

const TEST_PASSWORD = '123456'
const LOCAL_HOSTS = ['localhost', '127.0.0.1']

const catalogs = [
  { type: 'support_type', code: 'emotional', name: 'Emocional' },
  { type: 'support_type', code: 'academic', name: 'Académico' },
  { type: 'support_type', code: 'social', name: 'Social' },
  { type: 'support_type', code: 'economic', name: 'Económico' },
  { type: 'support_type', code: 'coexistence', name: 'Convivencia' },
  { type: 'support_type', code: 'other', name: 'Otro' },
  { type: 'campus', code: 'central', name: 'Casa central' },
  { type: 'campus', code: 'north', name: 'Sede norte' },
  { type: 'campus', code: 'south', name: 'Sede sur' },
  { type: 'unit', code: 'psychology', name: 'Atención psicológica' },
  { type: 'unit', code: 'social_work', name: 'Trabajo social' },
  { type: 'unit', code: 'counseling', name: 'Orientación estudiantil' },
  { type: 'unit', code: 'academic', name: 'Apoyo académico' },
  { type: 'unit', code: 'welfare', name: 'Dirección de bienestar' },
]

// Evita borrar una base que no sea la local de desarrollo
function ensureLocalDatabase() {
  const { hostname } = new URL(process.env.MONGO_URI)

  if (process.env.NODE_ENV === 'production' || !LOCAL_HOSTS.includes(hostname)) {
    console.error('Seed cancelled: it only runs against a local development database')
    process.exit(1)
  }
}

async function resetDatabase() {
  await mongoose.connection.dropDatabase()
  await Promise.all(Object.values(models).map((model) => model.syncIndexes()))
}

async function seedUsers(findCatalog) {
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10)
  const campus = findCatalog('campus', 'central')

  const users = [
    {
      name: 'Ana Pérez',
      email: 'estudiante@test.cl',
      role: 'student',
      studentCode: '2026001',
      program: 'Ingeniería en Computación',
    },
    { name: 'Jorge Rojas', email: 'docente@test.cl', role: 'teacher' },
    {
      name: 'Marcela Soto',
      email: 'consejero@test.cl',
      role: 'counselor',
      unit: findCatalog('unit', 'counseling'),
    },
    {
      name: 'Carolina Muñoz',
      email: 'profesional@test.cl',
      role: 'professional',
      unit: findCatalog('unit', 'psychology'),
    },
    {
      name: 'Admin Bienestar',
      email: 'admin@test.cl',
      role: 'admin',
      unit: findCatalog('unit', 'welfare'),
    },
  ]

  await User.insertMany(users.map((user) => ({ ...user, passwordHash, campus })))
}

ensureLocalDatabase()
await connectDB()
await resetDatabase()

const savedCatalogs = await Catalog.insertMany(catalogs)
const findCatalog = (type, code) =>
  savedCatalogs.find((item) => item.type === type && item.code === code)._id

await seedUsers(findCatalog)

console.log(`Seed completed. Test users password: ${TEST_PASSWORD}`)
await mongoose.disconnect()
