import mongoose from 'mongoose'
import { SESSION_IDLE_SECONDS } from '../config/constants.js'

const { ObjectId } = mongoose.Schema.Types

const sessionSchema = new mongoose.Schema({
  user: { type: ObjectId, ref: 'User', required: true },
  tokenId: { type: String, required: true, unique: true },
  lastActivityAt: { type: Date, default: Date.now },
})

// MongoDB elimina la sesión tras 30 minutos sin actividad
sessionSchema.index({ lastActivityAt: 1 }, { expireAfterSeconds: SESSION_IDLE_SECONDS })

export default mongoose.model('Session', sessionSchema)
