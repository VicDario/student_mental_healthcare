import { Router } from 'express'
import appointmentRoutes from './appointment.routes.js'
import auditRoutes from './audit.routes.js'
import authRoutes from './auth.routes.js'
import catalogRoutes from './catalog.routes.js'
import notificationRoutes from './notification.routes.js'
import requestRoutes from './request.routes.js'
import userRoutes from './user.routes.js'
import workshopRoutes from './workshop.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/catalogs', catalogRoutes)
router.use('/audit-logs', auditRoutes)
router.use('/workshops', workshopRoutes)
router.use('/notifications', notificationRoutes)
router.use('/requests', requestRoutes)
router.use('/appointments', appointmentRoutes)

export default router
