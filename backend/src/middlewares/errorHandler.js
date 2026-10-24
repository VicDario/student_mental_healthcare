export function notFound(req, res) {
  res.status(404).json({ message: 'Ruta no encontrada' })
}

export function errorHandler(err, req, res, next) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ message: 'Datos inválidos' })
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'El registro ya existe' })
  }

  console.error(err)
  res.status(500).json({ message: 'Error interno del servidor' })
}
