import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  user: {
    type: String
  },
  email: {
    type: String
  },
  score: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User', UserSchema)