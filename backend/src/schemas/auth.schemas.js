import { z } from 'zod'

const MIN_PASSWORD_LENGTH = 6

const email = z
  .string({ error: 'El correo es obligatorio' })
  .trim()
  .toLowerCase()
  .min(1, 'El correo es obligatorio')

const password = z
  .string({ error: 'La contraseña es obligatoria' })
  .min(1, 'La contraseña es obligatoria')

export const registerSchema = z.object({
  name: z.string({ error: 'El nombre es obligatorio' }).trim().min(1, 'El nombre es obligatorio'),
  email: email.pipe(z.email('El correo no es válido')),
  password: password.min(
    MIN_PASSWORD_LENGTH,
    `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
  ),
  studentCode: z.string({ error: 'El código de estudiante debe ser texto' }).trim().optional(),
  program: z.string({ error: 'La carrera debe ser texto' }).trim().optional(),
  phone: z.string({ error: 'El teléfono debe ser texto' }).trim().optional(),
})

// El login no valida el formato del correo: si no existe, responde lo mismo que una contraseña incorrecta
export const loginSchema = z.object({ email, password })
