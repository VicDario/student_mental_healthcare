import { Router } from 'express'
import { createCatalog, listCatalogs, updateCatalog } from '../controllers/catalog.controller.js'
import { authorize } from '../middlewares/authorize.js'
import { validate, validateQuery } from '../middlewares/validate.js'
import {
  createCatalogSchema,
  listCatalogsQuerySchema,
  updateCatalogSchema,
} from '../schemas/catalog.schemas.js'

const router = Router()

// Cualquier usuario autenticado puede leer los catálogos (los necesita para llenar formularios)
router.get('/', authorize(), validateQuery(listCatalogsQuerySchema), listCatalogs)
router.post('/', authorize('admin'), validate(createCatalogSchema), createCatalog)
router.put('/:id', authorize('admin'), validate(updateCatalogSchema), updateCatalog)

export default router
