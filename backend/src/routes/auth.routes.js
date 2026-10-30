import { Router } from 'express'
import { getMe, login, logout, register } from '../controllers/auth.controller.js'
import { authorize } from '../middlewares/authorize.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', authorize(), logout)
router.get('/me', authorize(), getMe)

export default router
