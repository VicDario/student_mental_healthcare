import { Notification } from '../models/index.js'
import { HttpError } from '../utils/httpError.js'

// Nombres de los estados en lenguaje claro para el estudiante
const STATUS_LABELS = {
  received: 'recibida',
  classified: 'en revisión',
  assigned: 'asignada a un profesional',
  in_progress: 'en atención',
  closed: 'cerrada',
}

// Mensajes cortos y respetuosos. Nunca incluyen el motivo, la descripción ni datos
// sensibles del caso: solo el código de la solicitud para que el estudiante la ubique.
const MESSAGES = {
  received: ({ code }) =>
    `Recibimos tu solicitud ${code}. Un consejero la revisará y te contactaremos pronto.`,
  assigned: ({ code }) =>
    `Tu solicitud ${code} fue asignada a un profesional, que se comunicará contigo.`,
  status_changed: ({ code, status }) =>
    `Tu solicitud ${code} ahora está ${STATUS_LABELS[status] ?? 'actualizada'}.`,
  appointment: ({ code }) =>
    `Tienes una nueva cita por tu solicitud ${code}. Revisa la fecha y hora en la plataforma.`,
}

function toPublicNotification(notification) {
  return {
    id: notification.id,
    type: notification.type,
    message: notification.message,
    request: notification.request ?? null,
    read: notification.readAt !== null,
    readAt: notification.readAt,
    createdAt: notification.createdAt,
  }
}

// Utilidad común para que las demás funcionalidades notifiquen al estudiante.
// Ejemplo: await notify({ user: request.student, type: 'received', request })
// request debe traer _id y code; status solo se usa en 'status_changed'.
export async function notify({ user, type, request, status }) {
  const buildMessage = MESSAGES[type]
  if (!buildMessage) {
    throw new Error(`Tipo de notificación desconocido: ${type}`)
  }

  const notification = await Notification.create({
    user,
    type,
    request: request?._id,
    message: buildMessage({ code: request?.code, status }),
  })

  return toPublicNotification(notification)
}

// Cada usuario ve solo sus notificaciones, de la más nueva a la más antigua
export async function listNotifications(userId, { unread }) {
  const filter = { user: userId }
  if (unread === 'true') filter.readAt = null

  const notifications = await Notification.find(filter).sort({ createdAt: -1 })
  return notifications.map(toPublicNotification)
}

// Si la notificación es de otro usuario responde 404, para no revelar que existe
export async function markAsRead(id, userId) {
  const notification = await Notification.findOne({ _id: id, user: userId })
  if (!notification) {
    throw new HttpError(404, 'Notificación no encontrada')
  }

  if (notification.readAt === null) {
    notification.readAt = new Date()
    await notification.save()
  }

  return toPublicNotification(notification)
}
