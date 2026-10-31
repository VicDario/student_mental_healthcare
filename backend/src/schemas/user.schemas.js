import { z } from 'zod'
import { ROLES } from '../config/constants.js'

const MIN_PASSWORD_LENGTH = 6

// Id de MongoDB: 24 caracteres hexadecimales
const objectId = (label) =>
  z.string({ error: `${label} no es válida` }).regex(/^[0-9a-f]{24}$/i, `${label} no es válida`)

const optionalText = (label) =>
  z
    .string({ error: `${label} debe ser texto` })
    .trim()
    .optional()

const name = z
  .string({ error: 'El nombre es obligatorio' })
  .trim()
  .min(1, 'El nombre es obligatorio')

const email = z
  .string({ error: 'El correo es obligatorio' })
  .trim()
  .toLowerCase()
  .pipe(z.email('El correo no es válido'))

const role = z.enum(ROLES, { error: 'El perfil no es válido' })

const userFields = {
  name,
  email,
  role,
  campus: objectId('La sede').optional(),
  unit: objectId('La unidad de apoyo').optional(),
  studentCode: optionalText('El código de estudiante'),
  program: optionalText('La carrera'),
  phone: optionalText('El teléfono'),
}

// El administrador crea cuentas de cualquier perfil, con una contraseña inicial
export const createUserSchema = z.object({
  ...userFields,
  password: z
    .string({ error: 'La contraseña es obligatoria' })
    .min(
      MIN_PASSWORD_LENGTH,
      `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
    ),
})

// En la edición todos los campos son opcionales, pero debe venir al menos uno.
// El estado (activo/inactivo) no se cambia aquí, sino con /deactivate y /activate.
export const updateUserSchema = z
  .object(userFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Debes enviar al menos un campo para actualizar')

// Filtros del listado: GET /api/users?role=&active=&search=
export const listUsersQuerySchema = z.object({
  role: role.optional(),
  active: z.enum(['true', 'false'], { error: 'El filtro de estado no es válido' }).optional(),
  search: z.string().trim().optional(),
})
