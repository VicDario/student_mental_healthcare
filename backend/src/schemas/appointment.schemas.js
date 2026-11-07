import { z } from 'zod'
import { APPOINTMENT_MODALITIES, APPOINTMENT_STATUSES } from '../config/constants.js'

// Id de MongoDB: 24 caracteres hexadecimales
const objectId = (message) => z.string({ error: message }).regex(/^[0-9a-f]{24}$/i, message)

// POST /api/appointments
// Que la fecha sea futura lo revisa el servicio
export const createAppointmentSchema = z.object({
  request: objectId('La solicitud no es válida'),
  startsAt: z.coerce.date({ error: 'La fecha de la cita no es válida' }),
  durationMinutes: z
    .number({ error: 'La duración debe ser un número' })
    .int('La duración debe ser un número entero')
    .min(15, 'La duración mínima es de 15 minutos')
    .max(180, 'La duración máxima es de 180 minutos')
    .optional(),
  modality: z.enum(APPOINTMENT_MODALITIES, { error: 'La modalidad debe ser in_person u online' }),
  location: z.string({ error: 'El lugar debe ser texto' }).trim().optional(),
})

// PATCH /api/appointments/:id/status
// Una cita agendada termina como realizada, cancelada o inasistencia
export const updateAppointmentStatusSchema = z.object({
  status: z.enum(
    APPOINTMENT_STATUSES.filter((status) => status !== 'scheduled'),
    { error: 'El estado debe ser completed, cancelled o no_show' },
  ),
})

// GET /api/appointments?status=&request=
export const listAppointmentsQuerySchema = z.object({
  status: z.enum(APPOINTMENT_STATUSES, { error: 'El filtro de estado no es válido' }).optional(),
  request: objectId('La solicitud no es válida').optional(),
})
