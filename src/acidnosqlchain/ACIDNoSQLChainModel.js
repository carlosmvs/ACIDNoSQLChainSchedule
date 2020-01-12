import mongoose from 'mongoose'

const ScheduleSchema = new mongoose.Schema({
  title: {
    type: String
  },
  price: {
    type: Number
  },
  date: {
    type: String
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sender'
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipient'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Schedule', ScheduleSchema)