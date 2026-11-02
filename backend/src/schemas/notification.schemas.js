import { z } from 'zod'

// Filtros del listado: GET /api/notifications?unread=true
export const listNotificationsQuerySchema = z.object({
  unread: z.enum(['true', 'false'], { error: 'El filtro de no leídas no es válido' }).optional(),
})
