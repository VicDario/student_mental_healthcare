import { Router } from 'express'
import { createRequest, getRequest, listRequests } from '../controllers/request.controller.js'
import {
  assignRequest,
  classifyRequest,
  closeRequest,
  createFollowUp,
  createReferral,
  listFollowUps,
} from '../controllers/requestFlow.controller.js'
import { allowRoles, requireAuth } from '../middlewares/authorize.js'
import { validate, validateQuery } from '../middlewares/validate.js'
import { createRequestSchema, listRequestsQuerySchema } from '../schemas/request.schemas.js'
import {
  assignRequestSchema,
  classifyRequestSchema,
  closeRequestSchema,
  createFollowUpSchema,
  createReferralSchema,
} from '../schemas/requestFlow.schemas.js'

const router = Router()

// Todas las rutas exigen sesión; qué solicitudes ve cada perfil lo decide el servicio
router.use(requireAuth)

router.get('/', validateQuery(listRequestsQuerySchema), listRequests)
router.post('/', allowRoles('student'), validate(createRequestSchema), createRequest)

// Derivación docente (#17). Va antes de '/:id' para que "referral" no se lea como un id
router.post('/referral', allowRoles('teacher'), validate(createReferralSchema), createReferral)
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

// Observaciones de seguimiento (#20). Estudiantes y docentes nunca las ven
router.get('/:id/follow-ups', allowRoles('professional', 'counselor', 'admin'), listFollowUps)
router.post(
  '/:id/follow-ups',
  allowRoles('professional', 'counselor'),
  validate(createFollowUpSchema),
  createFollowUp,
)

// Cierre del caso (#21)
router.patch(
  '/:id/close',
  allowRoles('professional', 'counselor'),
  validate(closeRequestSchema),
  closeRequest,
)

export default router
