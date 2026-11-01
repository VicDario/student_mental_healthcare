import { Router } from 'express'
import {
  cancelEnrollment,
  cancelWorkshop,
  createWorkshop,
  enroll,
  listEnrollments,
  listWorkshops,
  markAttendance,
  updateWorkshop,
} from '../controllers/workshop.controller.js'
import { allowRoles, requireAuth } from '../middlewares/authorize.js'
import { validate, validateQuery } from '../middlewares/validate.js'
import {
  createWorkshopSchema,
  listWorkshopsQuerySchema,
  updateWorkshopSchema,
} from '../schemas/workshop.schemas.js'

const router = Router()
const staff = allowRoles('admin', 'professional')

router.use(requireAuth)

// Cualquier usuario autenticado ve los talleres
router.get('/', validateQuery(listWorkshopsQuerySchema), listWorkshops)

// El estudiante se inscribe o cancela su propia inscripción
router.post('/:id/enrollments', allowRoles('student'), enroll)
router.delete('/:id/enrollments', allowRoles('student'), cancelEnrollment)

// El equipo (administrador y profesionales) gestiona talleres, inscritos y asistencia
router.post('/', staff, validate(createWorkshopSchema), createWorkshop)
router.put('/:id', staff, validate(updateWorkshopSchema), updateWorkshop)
router.delete('/:id', staff, cancelWorkshop)
router.get('/:id/enrollments', staff, listEnrollments)
router.patch('/:id/enrollments/:enrollmentId/attendance', staff, markAttendance)

export default router
