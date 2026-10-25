import mongoose from 'mongoose'

const { ObjectId } = mongoose.Schema.Types

// Colección separada para que estudiantes y docentes nunca reciban estas notas
const followUpSchema = new mongoose.Schema(
  {
    request: { type: ObjectId, ref: 'SupportRequest', required: true, index: true },
    author: { type: ObjectId, ref: 'User', required: true },
    // Se almacena cifrado (issue #12)
    text: { type: String, required: true },
  },
  { timestamps: true },
)

export default mongoose.model('FollowUp', followUpSchema)
