import { z } from 'zod'
import { WORKSHOP_KINDS, WORKSHOP_MODALITIES, WORKSHOP_STATUSES } from '../config/constants.js'

// Id de MongoDB: 24 caracteres hexadecimales
const objectId = (message) => z.string({ error: message }).regex(/^[0-9a-f]{24}$/i, message)

const optionalText = (label) =>
  z
    .string({ error: `${label} debe ser texto` })
    .trim()
    .optional()

const kind = z.enum(WORKSHOP_KINDS, { error: 'El tipo de actividad no es válido' })

// La fecha llega como texto (ej. "2026-11-20T15:00:00Z") y se convierte a Date
const date = (message) => z.coerce.date({ error: message })

const workshopFields = {
  title: z.string({ error: 'El título es obligatorio' }).trim().min(1, 'El título es obligatorio'),
  description: optionalText('La descripción'),
  kind,
  category: optionalText('La categoría'),
  modality: z.enum(WORKSHOP_MODALITIES, { error: 'La modalidad no es válida' }),
  location: optionalText('El lugar'),
  campus: objectId('La sede no es válida').optional(),
  facilitator: objectId('El facilitador no es válido').optional(),
  startsAt: date('La fecha de inicio no es válida'),
  endsAt: date('La fecha de término no es válida'),
  capacity: z
    .number({ error: 'El cupo debe ser un número' })
    .int('El cupo debe ser un número entero')
    .positive('El cupo debe ser mayor a cero'),
}

// Que la fecha de término sea posterior a la de inicio lo revisa el servicio,
// porque en la edición puede llegar solo una de las dos fechas.
export const createWorkshopSchema = z.object(workshopFields)

// En la edición todos los campos son opcionales, pero debe venir al menos uno.
// El estado no se cambia aquí: para cancelar se usa DELETE /api/workshops/:id.
export const updateWorkshopSchema = z
  .object(workshopFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Debes enviar al menos un campo para actualizar')

// Filtros del listado: GET /api/workshops?status=&kind=
export const listWorkshopsQuerySchema = z.object({
  status: z.enum(WORKSHOP_STATUSES, { error: 'El filtro de estado no es válido' }).optional(),
  kind: kind.optional(),
})
