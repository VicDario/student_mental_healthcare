import { HttpError } from '../utils/httpError.js'

// Convierte los errores de Zod al formato de la API: [{ field, message }]
function toFieldErrors(issues) {
  return issues.map((issue) => ({
    field: issue.path.join('.') || null,
    message: issue.message,
  }))
}

// Lanza un 400 con todos los campos inválidos.
// El message es el primer error para que el frontend pueda mostrarlo directamente.
function throwValidationError(error) {
  const errors = toFieldErrors(error.issues)
  throw new HttpError(400, errors[0].message, errors)
}

// Valida req.body con un esquema de Zod y lo reemplaza por los datos limpios.
// Los campos que no están en el esquema se descartan.
export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body ?? {})
    if (!result.success) throwValidationError(result.error)

    req.body = result.data
    next()
  }
}

// Igual que validate, pero para los filtros de la URL (?role=...).
// En Express 5 req.query no se puede reemplazar, así que los datos limpios quedan en req.filters.
export function validateQuery(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.query ?? {})
    if (!result.success) throwValidationError(result.error)

    req.filters = result.data
    next()
  }
}

// Revisa que los parámetros de la ruta (ej. :id) sean identificadores válidos de MongoDB
export function validateIds(...params) {
  const objectId = /^[0-9a-fA-F]{24}$/

  return (req, _res, next) => {
    const errors = params
      .filter((param) => !objectId.test(req.params[param] ?? ''))
      .map((param) => ({ field: param, message: 'El identificador no es válido' }))

    if (errors.length > 0) throw new HttpError(400, errors[0].message, errors)
    next()
  }
}
