import mongoose from 'mongoose'
import {
  CLOSURE_REFERRAL_TYPES,
  CONTACT_CHANNELS,
  REQUEST_ORIGINS,
  REQUEST_STATUSES,
  URGENCY_LEVELS,
} from '../config/constants.js'

const { ObjectId } = mongoose.Schema.Types

const referralSchema = new mongoose.Schema(
  {
    teacher: { type: ObjectId, ref: 'User', required: true },
    course: { type: String, trim: true },
    observedSituation: { type: String, required: true },
    studentInformed: { type: Boolean, required: true },
  },
  { _id: false },
)

const contactSchema = new mongoose.Schema(
  {
    channel: { type: String, enum: CONTACT_CHANNELS, required: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false },
)

const statusChangeSchema = new mongoose.Schema(
  {
    status: { type: String, enum: REQUEST_STATUSES, required: true },
    changedBy: { type: ObjectId, ref: 'User', required: true },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false },
)

const closureSchema = new mongoose.Schema(
  {
    reason: { type: String, required: true },
    referralType: { type: String, enum: CLOSURE_REFERRAL_TYPES, required: true },
    referralDestination: { type: String, trim: true },
    closedBy: { type: ObjectId, ref: 'User', required: true },
    closedAt: { type: Date, default: Date.now },
  },
  { _id: false },
)

const supportRequestSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    student: { type: ObjectId, ref: 'User', required: true },
    origin: { type: String, enum: REQUEST_ORIGINS, default: 'self' },
    referral: { type: referralSchema },
    reason: { type: String, required: true, trim: true },
    // Se almacena cifrado (issue #12)
    description: { type: String, required: true },
    perceivedUrgency: { type: String, enum: URGENCY_LEVELS, required: true },
    priority: { type: String, enum: URGENCY_LEVELS },
    contact: { type: contactSchema, required: true },
    type: { type: ObjectId, ref: 'Catalog' },
    campus: { type: ObjectId, ref: 'Catalog' },
    assignedTo: { type: ObjectId, ref: 'User' },
    status: { type: String, enum: REQUEST_STATUSES, default: 'received' },
    statusHistory: [statusChangeSchema],
    closure: { type: closureSchema },
  },
  { timestamps: true },
)

export default mongoose.model('SupportRequest', supportRequestSchema)
