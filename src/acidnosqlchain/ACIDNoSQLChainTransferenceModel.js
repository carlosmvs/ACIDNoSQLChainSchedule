import mongoose from 'mongoose'

const ACIDNoSQLChainTransferenceSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sender'
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipient'
  },
  amount: {
    type: Number
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

export default mongoose.model('Transference', ACIDNoSQLChainTransferenceSchema)