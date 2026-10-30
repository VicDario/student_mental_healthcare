import { randomUUID } from 'node:crypto'
import { SESSION_IDLE_SECONDS } from '../config/constants.js'
import { Session } from '../models/index.js'

export async function createSession(userId) {
  const session = await Session.create({ user: userId, tokenId: randomUUID() })
  return session.tokenId
}

// Renueva la actividad; devuelve null si la sesión no existe o pasó el tiempo de inactividad.
// El índice TTL de MongoDB borra las sesiones cada ~60 s, por eso también se filtra por fecha.
export async function touchSession(tokenId, userId) {
  const idleLimit = new Date(Date.now() - SESSION_IDLE_SECONDS * 1000)

  return Session.findOneAndUpdate(
    { tokenId, user: userId, lastActivityAt: { $gt: idleLimit } },
    { lastActivityAt: new Date() },
  )
}

export async function deleteSession(tokenId) {
  await Session.deleteOne({ tokenId })
}
