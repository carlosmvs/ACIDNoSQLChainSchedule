import mongoose from 'mongoose'

const ClinicalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Clinical', ClinicalSchema)