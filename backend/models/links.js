const mongoose = require('mongoose')
const { Schema } = mongoose

const linksSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  githubLink: {
    type: String,
    match: /^https:\/\/github\.com\/[^\s]+$/
  },
  previewLink: {
    type: String
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Links', linksSchema)
