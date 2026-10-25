import mongoose from 'mongoose'
import { WORKSHOP_KINDS, WORKSHOP_MODALITIES, WORKSHOP_STATUSES } from '../config/constants.js'

const { ObjectId } = mongoose.Schema.Types

const workshopSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    kind: { type: String, enum: WORKSHOP_KINDS, required: true },
    category: { type: String, trim: true },
    modality: { type: String, enum: WORKSHOP_MODALITIES, required: true },
    location: { type: String, trim: true },
    campus: { type: ObjectId, ref: 'Catalog' },
    facilitator: { type: ObjectId, ref: 'User' },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    capacity: { type: Number, required: true, min: 1 },
    status: { type: String, enum: WORKSHOP_STATUSES, default: 'scheduled' },
  },
  { timestamps: true },
)

export default mongoose.model('Workshop', workshopSchema)
