import * as authService from '../services/auth.service.js'

// POST /api/auth/login
export async function login(req, res) {
  const result = await authService.login(req.body ?? {})
  res.json(result)
}

// GET /api/auth/me
export async function getMe(req, res) {
  const user = await authService.getProfile(req.user.id)
  res.json(user)
}
