import { HttpError } from '../utils/httpError.js'

// Todas las respuestas de error tienen el mismo formato: { message, errors: [{ field, message }] }
function sendError(res, status, message, errors = []) {
  return res.status(status).json({ message, errors })
}

export function notFound(_req, res) {
  sendError(res, 404, 'Ruta no encontrada')
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof HttpError) {
    return sendError(res, err.status, err.message, err.errors)
  }

  // Identificador con formato incorrecto (ej. /users/abc)
  if (err.name === 'CastError') {
    const message = 'El identificador no es válido'
    return sendError(res, 400, message, [{ field: err.path ?? null, message }])
  }

  // Validación del modelo de Mongoose: se informa el campo, pero no el mensaje técnico
  if (err.name === 'ValidationError') {
    const errors = Object.keys(err.errors ?? {}).map((field) => ({
      field,
      message: 'El valor no es válido',
    }))
    return sendError(res, 400, 'Hay datos inválidos', errors)
  }

  // Índice único repetido (ej. correo ya registrado)
  if (err.code === 11000) {
    const message = 'Ya existe un registro con ese valor'
    const fields = Object.keys(err.keyValue ?? err.keyPattern ?? {})
    return sendError(
      res,
      409,
      'El registro ya existe',
      fields.map((field) => ({ field, message })),
    )
  }

  // JSON mal escrito en el cuerpo de la solicitud
  if (err.type === 'entity.parse.failed') {
    return sendError(res, 400, 'El cuerpo de la solicitud no es un JSON válido')
  }

  // Otros errores de cliente de Express, ej. cuerpo muy grande (413)
  const status = err.status ?? err.statusCode
  if (status >= 400 && status < 500) {
    return sendError(res, status, 'Solicitud inválida')
  }

  // Error interno: se registra en el servidor, pero al cliente no se le muestran detalles
  console.error(err)
  sendError(res, 500, 'Error interno del servidor')
}
