import * as catalogService from '../services/catalog.service.js'

// GET /api/catalogs?type=
export async function listCatalogs(req, res) {
  const items = await catalogService.listCatalogs(req.filters, req.user.role)
  res.json(items)
}

// POST /api/catalogs
export async function createCatalog(req, res) {
  const item = await catalogService.createCatalog(req.body)
  res.status(201).json(item)
}

// PUT /api/catalogs/:id
export async function updateCatalog(req, res) {
  const item = await catalogService.updateCatalog(req.params.id, req.body)
  res.json(item)
}
