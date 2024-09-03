const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String
  },
  role: {
    type: String,
    default: 'student'
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User', UserSchema)
