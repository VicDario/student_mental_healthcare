import { Router } from 'express'
import authRoutes from './auth.routes.js'
import catalogRoutes from './catalog.routes.js'
import userRoutes from './user.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/catalogs', catalogRoutes)

export default router
