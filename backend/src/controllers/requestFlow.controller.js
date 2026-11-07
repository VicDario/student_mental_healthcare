import { auditActor } from '../services/audit.service.js'
import * as followUpService from '../services/followUp.service.js'
import * as requestFlowService from '../services/requestFlow.service.js'

// PATCH /api/requests/:id/classify
export async function classifyRequest(req, res) {
  const request = await requestFlowService.classifyRequest(req.params.id, req.body, auditActor(req))
  res.json(request)
}

// PATCH /api/requests/:id/assign
export async function assignRequest(req, res) {
  const request = await requestFlowService.assignRequest(req.params.id, req.body, auditActor(req))
  res.json(request)
}

// GET /api/requests/:id/follow-ups
export async function listFollowUps(req, res) {
  const followUps = await followUpService.listFollowUps(req.user, req.params.id, auditActor(req))
  res.json(followUps)
}

// POST /api/requests/:id/follow-ups
export async function createFollowUp(req, res) {
  const followUp = await followUpService.createFollowUp(
    req.params.id,
    req.body,
    req.user,
    auditActor(req),
  )
  res.status(201).json(followUp)
}

// PATCH /api/requests/:id/close
export async function closeRequest(req, res) {
  const request = await requestFlowService.closeRequest(
    req.params.id,
    req.body,
    req.user,
    auditActor(req),
  )
  res.json(request)
}
