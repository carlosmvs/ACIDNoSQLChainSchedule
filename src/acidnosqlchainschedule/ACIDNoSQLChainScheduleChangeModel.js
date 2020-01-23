import mongoose from 'mongoose'

const ChangeSchema = new mongoose.Schema({
  reserveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reserve'
  },
  oldDate: {
    type: String
  },
  newDate: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Change', ChangeSchema)