import { Router } from 'express'
import { listNotifications, markAsRead } from '../controllers/notification.controller.js'
import { authorize } from '../middlewares/authorize.js'
import { validateIds, validateQuery } from '../middlewares/validate.js'
import { listNotificationsQuerySchema } from '../schemas/notification.schemas.js'

const router = Router()

// Cualquier usuario autenticado, pero cada uno solo accede a sus propias notificaciones
router.use(authorize())

router.get('/', validateQuery(listNotificationsQuerySchema), listNotifications)
router.patch('/:id/read', validateIds('id'), markAsRead)

export default router
