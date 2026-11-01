import { Router } from 'express'
import {
  activateUser,
  createUser,
  deactivateUser,
  listUsers,
  updateUser,
} from '../controllers/user.controller.js'
import { authorize } from '../middlewares/authorize.js'
import { validate, validateQuery } from '../middlewares/validate.js'
import {
  createUserSchema,
  listUsersQuerySchema,
  updateUserSchema,
} from '../schemas/user.schemas.js'

const router = Router()

// Todas las rutas de usuarios son solo para el administrador de bienestar
router.use(authorize('admin'))

router.get('/', validateQuery(listUsersQuerySchema), listUsers)
router.post('/', validate(createUserSchema), createUser)
router.put('/:id', validate(updateUserSchema), updateUser)
router.patch('/:id/deactivate', deactivateUser)
router.patch('/:id/activate', activateUser)

export default router
