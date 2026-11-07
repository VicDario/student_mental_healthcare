import { Router } from 'express'
import {
  activateUser,
  createUser,
  deactivateUser,
  listUsers,
  updateUser,
} from '../controllers/user.controller.js'
import { allowRoles, requireAuth } from '../middlewares/authorize.js'
import { validate, validateQuery } from '../middlewares/validate.js'
import {
  createUserSchema,
  listUsersQuerySchema,
  updateUserSchema,
} from '../schemas/user.schemas.js'

const router = Router()

// El listado también lo usa el consejero, para elegir a quién asignar una solicitud (#19).
// El servicio le muestra solo al equipo que atiende casos.
router.get(
  '/',
  requireAuth,
  allowRoles('admin', 'counselor'),
  validateQuery(listUsersQuerySchema),
  listUsers,
)

// Todas las rutas de usuarios son solo para el administrador de bienestar
router.use(requireAuth, allowRoles('admin'))

router.post('/', validate(createUserSchema), createUser)
router.put('/:id', validate(updateUserSchema), updateUser)
router.patch('/:id/deactivate', deactivateUser)
router.patch('/:id/activate', activateUser)

export default router
