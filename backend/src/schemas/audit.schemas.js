import { z } from 'zod'
import { AUDIT_ACTIONS } from '../config/constants.js'

// Id de MongoDB: 24 caracteres hexadecimales
const objectId = (label) =>
  z.string({ error: `${label} no es válido` }).regex(/^[0-9a-f]{24}$/i, `${label} no es válido`)

// GET /api/audit-logs?entityId=&user=&action=&limit=
export const listAuditLogsQuerySchema = z.object({
  entityId: objectId('El id de la entidad').optional(),
  user: objectId('El id del usuario').optional(),
  action: z.enum(AUDIT_ACTIONS, { error: 'La acción no es válida' }).optional(),
  // Devuelve solo los más recientes
  limit: z.coerce
    .number({ error: 'El límite debe ser un número' })
    .int('El límite debe ser un número entero')
    .min(1, 'El límite debe ser al menos 1')
    .max(500, 'El límite no puede superar 500')
    .default(100),
})
