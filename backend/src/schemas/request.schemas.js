import { z } from 'zod'
import { CONTACT_CHANNELS, REQUEST_STATUSES, URGENCY_LEVELS } from '../config/constants.js'

// Id de MongoDB: 24 caracteres hexadecimales
const objectId = (label) =>
  z.string({ error: `${label} no es válida` }).regex(/^[0-9a-f]{24}$/i, `${label} no es válida`)

const requiredText = (message) => z.string({ error: message }).trim().min(1, message)

const contact = z.object(
  {
    channel: z.enum(CONTACT_CHANNELS, { error: 'El canal de contacto debe ser email o phone' }),
    value: requiredText('El dato de contacto es obligatorio'),
  },
  { error: 'El contacto es obligatorio' },
)

// El estudiante crea su propia solicitud. Si no indica sede, se usa la de su cuenta.
export const createRequestSchema = z.object({
  reason: requiredText('El motivo es obligatorio'),
  description: requiredText('La descripción es obligatoria'),
  perceivedUrgency: z.enum(URGENCY_LEVELS, {
    error: 'La urgencia percibida debe ser low, medium o high',
  }),
  contact,
  campus: objectId('La sede').optional(),
})

// Filtros del listado: GET /api/requests?status=
export const listRequestsQuerySchema = z.object({
  status: z.enum(REQUEST_STATUSES, { error: 'El filtro de estado no es válido' }).optional(),
})
