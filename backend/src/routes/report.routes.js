import { Router } from 'express'
import { getSummary } from '../controllers/report.controller.js'
import { allowRoles, requireAuth } from '../middlewares/authorize.js'
import { validateQuery } from '../middlewares/validate.js'
import { reportSummaryQuerySchema } from '../schemas/report.schemas.js'

const router = Router()

// Solo el administrador de bienestar ve los indicadores institucionales
router.use(requireAuth, allowRoles('admin'))

router.get('/summary', validateQuery(reportSummaryQuerySchema), getSummary)

export default router
