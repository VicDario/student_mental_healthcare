import { Router } from 'express'
import auditRoutes from './audit.routes.js'
import authRoutes from './auth.routes.js'
import catalogRoutes from './catalog.routes.js'
import requestRoutes from './request.routes.js'
import userRoutes from './user.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/catalogs', catalogRoutes)
router.use('/audit-logs', auditRoutes)
router.use('/requests', requestRoutes)

export default router
