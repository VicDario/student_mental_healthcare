import { Router } from 'express'
import { createCatalog, listCatalogs, updateCatalog } from '../controllers/catalog.controller.js'
import { allowRoles, requireAuth } from '../middlewares/authorize.js'
import { validate, validateQuery } from '../middlewares/validate.js'
import {
  createCatalogSchema,
  listCatalogsQuerySchema,
  updateCatalogSchema,
} from '../schemas/catalog.schemas.js'

const router = Router()

// Cualquier usuario autenticado puede leer los catálogos (los necesita para llenar formularios)
router.get('/', requireAuth, validateQuery(listCatalogsQuerySchema), listCatalogs)
router.post('/', requireAuth, allowRoles('admin'), validate(createCatalogSchema), createCatalog)
router.put('/:id', requireAuth, allowRoles('admin'), validate(updateCatalogSchema), updateCatalog)

export default router
