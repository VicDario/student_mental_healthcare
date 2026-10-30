import { randomUUID } from 'node:crypto'
import { SESSION_IDLE_SECONDS } from '../config/constants.js'
import { Session } from '../models/index.js'

export async function createSession(userId) {
  const session = await Session.create({ user: userId, tokenId: randomUUID() })
  return session.tokenId
}

// Busca la sesión del token solo si tuvo actividad en los últimos 30 minutos.
// El índice TTL de MongoDB borra las sesiones cada ~60 s, por eso también se filtra por fecha.
export async function findActiveSession(tokenId, userId) {
  const idleLimit = new Date(Date.now() - SESSION_IDLE_SECONDS * 1000)

  return Session.findOne({ tokenId, user: userId, lastActivityAt: { $gt: idleLimit } })
}

// Registra actividad para que la sesión no expire mientras se usa
export async function updateLastActivity(session) {
  await Session.updateOne({ _id: session._id }, { lastActivityAt: new Date() })
}

export async function deleteSession(tokenId) {
  await Session.deleteOne({ tokenId })
}
