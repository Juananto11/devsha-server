'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
  conversationId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},
{
  timestamps: true
})

module.exports = mongoose.model('Message', MessageSchema)
