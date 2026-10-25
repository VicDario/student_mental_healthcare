import mongoose from 'mongoose'
import { NOTIFICATION_TYPES } from '../config/constants.js'

const { ObjectId } = mongoose.Schema.Types

const notificationSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: 'User', required: true, index: true },
    request: { type: ObjectId, ref: 'SupportRequest' },
    type: { type: String, enum: NOTIFICATION_TYPES, required: true },
    message: { type: String, required: true },
    readAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export default mongoose.model('Notification', notificationSchema)
