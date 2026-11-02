import { Router } from 'express'
import { listNotifications, markAsRead } from '../controllers/notification.controller.js'
import { requireAuth } from '../middlewares/authorize.js'
import { validateQuery } from '../middlewares/validate.js'
import { listNotificationsQuerySchema } from '../schemas/notification.schemas.js'

const router = Router()

// Cualquier usuario autenticado, pero cada uno solo accede a sus propias notificaciones
router.use(requireAuth)

router.get('/', validateQuery(listNotificationsQuerySchema), listNotifications)
router.patch('/:id/read', markAsRead)

export default router
