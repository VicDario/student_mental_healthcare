import mongoose from 'mongoose'
import { ROLES } from '../config/constants.js'

const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, required: true },
    campus: { type: ObjectId, ref: 'Catalog' },
    unit: { type: ObjectId, ref: 'Catalog' },
    studentCode: { type: String, trim: true },
    program: { type: String, trim: true },
    phone: { type: String, trim: true },
    active: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
)

export default mongoose.model('User', userSchema)
