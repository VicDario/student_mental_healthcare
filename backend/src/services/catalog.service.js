import { Catalog } from '../models/index.js'
import { HttpError } from '../utils/httpError.js'

const DUPLICATED_CODE = 'Ya existe un elemento con ese código en este catálogo'

function toPublicCatalog(item) {
  return { id: item.id, type: item.type, code: item.code, name: item.name, active: item.active }
}

async function ensureCodeAvailable(type, code, exceptId) {
  const filter = { type, code }
  if (exceptId) filter._id = { $ne: exceptId }

  const taken = await Catalog.exists(filter)
  if (taken) {
    throw new HttpError(409, DUPLICATED_CODE)
  }
}

// Los datos llegan validados por los esquemas de schemas/catalog.schemas.js

// El administrador ve también los elementos desactivados; el resto, solo los activos
export async function listCatalogs({ type }, role) {
  const filter = {}

  if (type) filter.type = type
  if (role !== 'admin') filter.active = true

  const items = await Catalog.find(filter).sort({ type: 1, name: 1 })
  return items.map(toPublicCatalog)
}

export async function createCatalog({ type, code, name }) {
  await ensureCodeAvailable(type, code)

  const item = await Catalog.create({ type, code, name })
  return toPublicCatalog(item)
}

// Para "eliminar" un elemento se envía active: false; nunca se borra de la base
export async function updateCatalog(id, data) {
  const item = await Catalog.findById(id)
  if (!item) {
    throw new HttpError(404, 'Elemento de catálogo no encontrado')
  }

  if (data.code) await ensureCodeAvailable(item.type, data.code, item._id)

  item.set(data)
  await item.save()

  return toPublicCatalog(item)
}
