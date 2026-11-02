import { z } from 'zod'
import { URGENCY_LEVELS } from '../config/constants.js'

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
