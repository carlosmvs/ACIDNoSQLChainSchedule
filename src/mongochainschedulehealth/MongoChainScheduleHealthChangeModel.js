import mongoose from 'mongoose'

const ChangeSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'appointment'
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