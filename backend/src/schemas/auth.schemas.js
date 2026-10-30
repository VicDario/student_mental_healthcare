import { z } from 'zod'

const MIN_PASSWORD_LENGTH = 6

const email = z
  .string({ error: 'El correo es obligatorio' })
  .trim()
  .toLowerCase()
  .pipe(z.email('El correo no es válido'))

export const registerSchema = z.object({
  name: z.string({ error: 'El nombre es obligatorio' }).trim().min(1, 'El nombre es obligatorio'),
  email,
  password: z
    .string({ error: 'La contraseña es obligatoria' })
    .min(
      MIN_PASSWORD_LENGTH,
      `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
    ),
  studentCode: z.string().trim().optional(),
  program: z.string().trim().optional(),
  phone: z.string().trim().optional(),
})

export const loginSchema = z.object({
  email,
  password: z
    .string({ error: 'La contraseña es obligatoria' })
    .min(1, 'La contraseña es obligatoria'),
})
