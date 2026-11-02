import * as notificationService from '../services/notification.service.js'

// GET /api/notifications
export async function listNotifications(req, res) {
  const notifications = await notificationService.listNotifications(req.user.id, req.filters)
  res.json(notifications)
}

// PATCH /api/notifications/:id/read
export async function markAsRead(req, res) {
  const notification = await notificationService.markAsRead(req.params.id, req.user.id)
  res.json(notification)
}
