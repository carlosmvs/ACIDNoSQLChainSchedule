import mongoose from 'mongoose'

const RegistrySchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  },
  clinicalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinical'
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

export default mongoose.model('Registry', RegistrySchema)