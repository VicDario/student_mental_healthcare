import { Router } from 'express'
import { createRequest, getRequest, listRequests } from '../controllers/request.controller.js'
import { assignRequest, classifyRequest } from '../controllers/requestFlow.controller.js'
import { allowRoles, requireAuth } from '../middlewares/authorize.js'
import { validate, validateQuery } from '../middlewares/validate.js'
import { createRequestSchema, listRequestsQuerySchema } from '../schemas/request.schemas.js'
import { assignRequestSchema, classifyRequestSchema } from '../schemas/requestFlow.schemas.js'

const router = Router()

// Todas las rutas exigen sesión; qué solicitudes ve cada perfil lo decide el servicio
router.use(requireAuth)

router.get('/', validateQuery(listRequestsQuerySchema), listRequests)
router.post('/', allowRoles('student'), validate(createRequestSchema), createRequest)
router.get('/:id', getRequest)

// Flujo de atención: clasificar (#18) y asignar a un profesional (#19)
router.patch(
  '/:id/classify',
  allowRoles('counselor'),
  validate(classifyRequestSchema),
  classifyRequest,
)
router.patch(
  '/:id/assign',
  allowRoles('counselor', 'admin'),
  validate(assignRequestSchema),
  assignRequest,
)

export default router
