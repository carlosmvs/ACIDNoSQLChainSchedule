import mongoose from 'mongoose'

const PatientSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('patient', PatientSchema)