import mongoose from 'mongoose'
import { AUDIT_ACTIONS, ROLES } from '../config/constants.js'

const { ObjectId } = mongoose.Schema.Types

// Solo se guardan nombres de campos modificados, nunca sus valores
const auditLogSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: 'User' },
    role: { type: String, enum: ROLES },
    action: { type: String, enum: AUDIT_ACTIONS, required: true },
    entity: { type: String },
    entityId: { type: ObjectId },
    changedFields: [String],
    ip: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export default mongoose.model('AuditLog', auditLogSchema)
