import { z } from 'zod'

// GET /api/reports/summary?from=&to=&campus=
// Las fechas llegan como texto (ej. 2026-11-01) y se convierten a Date
export const reportSummaryQuerySchema = z
  .object({
    from: z.coerce.date({ error: 'La fecha de inicio no es válida' }).optional(),
    to: z.coerce.date({ error: 'La fecha de término no es válida' }).optional(),
    campus: z
      .string({ error: 'La sede no es válida' })
      .regex(/^[0-9a-f]{24}$/i, 'La sede no es válida')
      .optional(),
  })
  .refine((data) => !data.from || !data.to || data.from <= data.to, {
    message: 'La fecha de inicio debe ser anterior a la de término',
    path: ['from'],
  })
