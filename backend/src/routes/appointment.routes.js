import { Router } from 'express'
import {
  createAppointment,
  listAppointments,
  updateAppointmentStatus,
} from '../controllers/appointment.controller.js'
import { allowRoles, requireAuth } from '../middlewares/authorize.js'
import { validate, validateQuery } from '../middlewares/validate.js'
import {
  createAppointmentSchema,
  listAppointmentsQuerySchema,
  updateAppointmentStatusSchema,
} from '../schemas/appointment.schemas.js'

const router = Router()
const staff = allowRoles('professional', 'counselor')

router.use(requireAuth)

// Cada perfil ve solo sus citas (lo decide el servicio)
router.get('/', validateQuery(listAppointmentsQuerySchema), listAppointments)

// El profesional asignado o un consejero agenda y actualiza citas
router.post('/', staff, validate(createAppointmentSchema), createAppointment)
router.patch('/:id/status', staff, validate(updateAppointmentStatusSchema), updateAppointmentStatus)

export default router
