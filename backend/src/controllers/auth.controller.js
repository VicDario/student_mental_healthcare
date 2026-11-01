import { auditActor } from '../services/audit.service.js'
import * as authService from '../services/auth.service.js'

// POST /api/auth/register
export async function register(req, res) {
  const user = await authService.register(req.body)
  res.status(201).json(user)
}

// POST /api/auth/login
export async function login(req, res) {
  const result = await authService.login(req.body, req.ip)
  res.json(result)
}

// POST /api/auth/logout
export async function logout(req, res) {
  await authService.logout(req.tokenId, auditActor(req))
  res.status(204).end()
}

// GET /api/auth/me
export async function getMe(req, res) {
  const user = await authService.getProfile(req.user.id)
  res.json(user)
}
