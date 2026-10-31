import { Router } from 'express'
import { getMe, login, logout, register } from '../controllers/auth.controller.js'
import { requireAuth } from '../middlewares/authorize.js'
import { validate } from '../middlewares/validate.js'
import { loginSchema, registerSchema } from '../schemas/auth.schemas.js'

const router = Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/logout', requireAuth, logout)
router.get('/me', requireAuth, getMe)

export default router
