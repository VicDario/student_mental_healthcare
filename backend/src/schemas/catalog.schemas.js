import { z } from 'zod'
import { CATALOG_TYPES } from '../config/constants.js'

const type = z.enum(CATALOG_TYPES, { error: 'El tipo de catálogo no es válido' })

// Código interno, ej. "central" o "social_work": minúsculas, números y guion bajo
const code = z
  .string({ error: 'El código es obligatorio' })
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9_]+$/, 'El código solo puede tener letras, números y guion bajo')

const name = z
  .string({ error: 'El nombre es obligatorio' })
  .trim()
  .min(1, 'El nombre es obligatorio')

export const createCatalogSchema = z.object({ type, code, name })

// El tipo no se cambia. Para "eliminar" un elemento se envía active: false.
export const updateCatalogSchema = z
  .object({
    code,
    name,
    active: z.boolean({ error: 'El estado debe ser verdadero o falso' }),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Debes enviar al menos un campo para actualizar')

// Filtros del listado: GET /api/catalogs?type=
export const listCatalogsQuerySchema = z.object({
  type: type.optional(),
})
