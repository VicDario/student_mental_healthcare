import mongoose from 'mongoose'
import { ENROLLMENT_STATUSES } from '../config/constants.js'

const { ObjectId } = mongoose.Schema.Types

const enrollmentSchema = new mongoose.Schema(
  {
    workshop: { type: ObjectId, ref: 'Workshop', required: true },
    student: { type: ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ENROLLMENT_STATUSES, default: 'enrolled' },
  },
  { timestamps: true },
)

enrollmentSchema.index({ workshop: 1, student: 1 }, { unique: true })

export default mongoose.model('Enrollment', enrollmentSchema)
