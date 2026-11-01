import { Router } from 'express'
import { listAuditLogs } from '../controllers/audit.controller.js'
import { allowRoles, requireAuth } from '../middlewares/authorize.js'
import { validateQuery } from '../middlewares/validate.js'
import { listAuditLogsQuerySchema } from '../schemas/audit.schemas.js'

const router = Router()

// Solo lectura para admin: la bitácora no se edita ni se borra
router.get(
  '/',
  requireAuth,
  allowRoles('admin'),
  validateQuery(listAuditLogsQuerySchema),
  listAuditLogs,
)

export default router
