import { Router } from 'express'
import { getMe, login } from '../controllers/auth.controller.js'
import { authorize } from '../middlewares/authorize.js'

const router = Router()

router.post('/login', login)
router.get('/me', authorize(), getMe)

export default router
