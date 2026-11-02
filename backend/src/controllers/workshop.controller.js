import { auditActor } from '../services/audit.service.js'
import * as workshopService from '../services/workshop.service.js'

// GET /api/workshops
export async function listWorkshops(req, res) {
  const workshops = await workshopService.listWorkshops(req.filters)
  res.json(workshops)
}

// POST /api/workshops
export async function createWorkshop(req, res) {
  const workshop = await workshopService.createWorkshop(req.body, auditActor(req))
  res.status(201).json(workshop)
}

// PUT /api/workshops/:id
export async function updateWorkshop(req, res) {
  const workshop = await workshopService.updateWorkshop(req.params.id, req.body, auditActor(req))
  res.json(workshop)
}

// DELETE /api/workshops/:id
export async function cancelWorkshop(req, res) {
  const workshop = await workshopService.cancelWorkshop(req.params.id, auditActor(req))
  res.json(workshop)
}

// POST /api/workshops/:id/enrollments
export async function enroll(req, res) {
  const enrollment = await workshopService.enroll(req.params.id, req.user.id)
  res.status(201).json(enrollment)
}

// DELETE /api/workshops/:id/enrollments
export async function cancelEnrollment(req, res) {
  const enrollment = await workshopService.cancelEnrollment(req.params.id, req.user.id)
  res.json(enrollment)
}

// GET /api/workshops/:id/enrollments
export async function listEnrollments(req, res) {
  const enrollments = await workshopService.listEnrollments(req.params.id)
  res.json(enrollments)
}

// PATCH /api/workshops/:id/enrollments/:enrollmentId/attendance
export async function markAttendance(req, res) {
  const enrollment = await workshopService.markAttendance(
    req.params.id,
    req.params.enrollmentId,
    auditActor(req),
  )
  res.json(enrollment)
}
