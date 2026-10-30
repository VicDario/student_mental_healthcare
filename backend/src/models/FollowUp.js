import mongoose from 'mongoose'
import { encryptedField } from '../utils/crypto.js'

const { ObjectId } = mongoose.Schema.Types

// Colección separada para que estudiantes y docentes nunca reciban estas notas
const followUpSchema = new mongoose.Schema(
  {
    request: { type: ObjectId, ref: 'SupportRequest', required: true, index: true },
    author: { type: ObjectId, ref: 'User', required: true },
    // Se guarda cifrado con AES-256-GCM y se descifra al leerlo
    text: { type: String, required: true, ...encryptedField },
  },
  // getters: true para que res.json() también devuelva el texto descifrado
  { timestamps: true, toJSON: { getters: true }, toObject: { getters: true } },
)

export default mongoose.model('FollowUp', followUpSchema)
