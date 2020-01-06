import mongoose from 'mongoose'

const ReservationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipient'
  },
  datesReserved: {
    type: Array
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Reservation', ReservationSchema)