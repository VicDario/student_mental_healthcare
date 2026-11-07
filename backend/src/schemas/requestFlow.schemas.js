import { z } from 'zod'
import { CLOSURE_REFERRAL_TYPES, URGENCY_LEVELS } from '../config/constants.js'

// Id de MongoDB: 24 caracteres hexadecimales
const objectId = (message) => z.string({ error: message }).regex(/^[0-9a-f]{24}$/i, message)

// PATCH /api/requests/:id/classify
export const classifyRequestSchema = z.object({
  type: objectId('El tipo de apoyo no es válido'),
  priority: z.enum(URGENCY_LEVELS, { error: 'La prioridad debe ser low, medium o high' }),
})

// PATCH /api/requests/:id/assign
export const assignRequestSchema = z.object({
  assignedTo: objectId('El profesional no es válido'),
})

// POST /api/requests/:id/follow-ups
export const createFollowUpSchema = z.object({
  text: z
    .string({ error: 'La observación es obligatoria' })
    .trim()
    .min(1, 'La observación es obligatoria')
    .max(5000, 'La observación no puede superar los 5000 caracteres'),
})

// PATCH /api/requests/:id/close
// Si hay derivación (interna o externa), el destino es obligatorio
export const closeRequestSchema = z
  .object({
    reason: z
      .string({ error: 'El motivo de cierre es obligatorio' })
      .trim()
      .min(1, 'El motivo de cierre es obligatorio'),
    referralType: z.enum(CLOSURE_REFERRAL_TYPES, {
      error: 'El tipo de derivación debe ser internal, external o none',
    }),
    referralDestination: z
      .string({ error: 'El destino de la derivación debe ser texto' })
      .trim()
      .optional(),
  })
  .refine((data) => data.referralType === 'none' || Boolean(data.referralDestination), {
    message: 'Indica a dónde se derivó al estudiante',
    path: ['referralDestination'],
  })
