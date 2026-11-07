import * as appointmentService from '../services/appointment.service.js'
import { auditActor } from '../services/audit.service.js'

// POST /api/appointments
export async function createAppointment(req, res) {
  const appointment = await appointmentService.createAppointment(
    req.body,
    req.user,
    auditActor(req),
  )
  res.status(201).json(appointment)
}

// GET /api/appointments
export async function listAppointments(req, res) {
  const appointments = await appointmentService.listAppointments(req.user, req.filters)
  res.json(appointments)
}

// PATCH /api/appointments/:id/status
export async function updateAppointmentStatus(req, res) {
  const appointment = await appointmentService.updateAppointmentStatus(
    req.params.id,
    req.body,
    req.user,
    auditActor(req),
  )
  res.json(appointment)
}
