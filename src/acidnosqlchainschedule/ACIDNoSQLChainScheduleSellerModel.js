import mongoose from 'mongoose'

const SellerSchema = new mongoose.Schema({
  seller: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Seller', SellerSchema)