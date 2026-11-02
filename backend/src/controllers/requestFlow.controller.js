import { auditActor } from '../services/audit.service.js'
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
