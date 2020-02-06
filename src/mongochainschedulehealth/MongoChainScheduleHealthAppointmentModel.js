import mongoose from 'mongoose'

const AppointmentSchema = new mongoose.Schema({
  title: {
    type: String
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patient'
  },
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'clinic'
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

export default mongoose.model('appointment', AppointmentSchema)