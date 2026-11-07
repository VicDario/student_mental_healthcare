import { auditActor } from '../services/audit.service.js'
import * as requestService from '../services/request.service.js'

// POST /api/requests
export async function createRequest(req, res) {
  const request = await requestService.createRequest(req.body, auditActor(req))
  res.status(201).json(request)
}

// GET /api/requests
export async function listRequests(req, res) {
  const requests = await requestService.listRequests(req.user, req.filters)
  res.json(requests)
}

// GET /api/requests/:id
export async function getRequest(req, res) {
  const request = await requestService.getRequest(req.user, req.params.id, auditActor(req))
  res.json(request)
}
