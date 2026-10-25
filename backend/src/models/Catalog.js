import mongoose from 'mongoose'
import { CATALOG_TYPES } from '../config/constants.js'

const catalogSchema = new mongoose.Schema(
  {
    type: { type: String, enum: CATALOG_TYPES, required: true },
    code: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

catalogSchema.index({ type: 1, code: 1 }, { unique: true })

export default mongoose.model('Catalog', catalogSchema)
