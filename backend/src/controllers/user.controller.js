import * as userService from '../services/user.service.js'

// GET /api/users
export async function listUsers(req, res) {
  const users = await userService.listUsers(req.filters)
  res.json(users)
}

// POST /api/users
export async function createUser(req, res) {
  const user = await userService.createUser(req.body)
  res.status(201).json(user)
}

// PUT /api/users/:id
export async function updateUser(req, res) {
  const user = await userService.updateUser(req.params.id, req.body)
  res.json(user)
}

// PATCH /api/users/:id/deactivate
export async function deactivateUser(req, res) {
  const user = await userService.deactivateUser(req.params.id, req.user.id)
  res.json(user)
}

// PATCH /api/users/:id/activate
export async function activateUser(req, res) {
  const user = await userService.activateUser(req.params.id)
  res.json(user)
}
