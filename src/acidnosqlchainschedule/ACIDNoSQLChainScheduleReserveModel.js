import mongoose from 'mongoose'

const ReserveSchema = new mongoose.Schema({
  name: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller'
  },
  date: {
    type: String
  },
  status: {
    type: String,
    default: 'Solicitado'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Reserve', ReserveSchema)