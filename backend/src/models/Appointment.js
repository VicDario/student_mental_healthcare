import mongoose from 'mongoose'
import { APPOINTMENT_MODALITIES, APPOINTMENT_STATUSES } from '../config/constants.js'

const { ObjectId } = mongoose.Schema.Types

const appointmentSchema = new mongoose.Schema(
  {
    request: { type: ObjectId, ref: 'SupportRequest', required: true },
    student: { type: ObjectId, ref: 'User', required: true },
    professional: { type: ObjectId, ref: 'User', required: true },
    startsAt: { type: Date, required: true },
    durationMinutes: { type: Number, default: 45, min: 15 },
    modality: { type: String, enum: APPOINTMENT_MODALITIES, required: true },
    location: { type: String, trim: true },
    status: { type: String, enum: APPOINTMENT_STATUSES, default: 'scheduled' },
  },
  { timestamps: true },
)

export default mongoose.model('Appointment', appointmentSchema)
