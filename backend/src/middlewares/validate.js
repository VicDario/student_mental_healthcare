import { HttpError } from '../utils/httpError.js'

// Valida req.body con un esquema de Zod y lo reemplaza por los datos limpios.
// Los campos que no están en el esquema se descartan.
export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body ?? {})

    if (!result.success) {
      const [firstIssue] = result.error.issues
      throw new HttpError(400, firstIssue.message)
    }

    req.body = result.data
    next()
  }
}
