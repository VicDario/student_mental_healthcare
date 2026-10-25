export function notFound(_req, res) {
  res.status(404).json({ message: 'Ruta no encontrada' })
}

export function errorHandler(err, _req, res, _next) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ message: 'Datos inválidos' })
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'El registro ya existe' })
  }

  // Errores de cliente de Express, ej. JSON mal formado (400) o cuerpo muy grande (413)
  const status = err.status ?? err.statusCode
  if (status >= 400 && status < 500) {
    return res.status(status).json({ message: 'Solicitud inválida' })
  }

  console.error(err)
  res.status(500).json({ message: 'Error interno del servidor' })
}
