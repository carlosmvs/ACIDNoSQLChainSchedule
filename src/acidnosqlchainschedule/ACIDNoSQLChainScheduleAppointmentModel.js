import mongoose from 'mongoose'

const AppointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  },
  clinicalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinical'
  },
  date: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Appointment', AppointmentSchema)