'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const Schema = mongoose.Schema

const UserSchema = Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: Boolean,
    default: false
  },
  fullName: {
    type: String,
    trim: true,
    default: ''
  },
  avatar: {
    type: String,
    trim: true,
    default: 'https://www.esparkinfo.com/wp-content/uploads/2016/08/default-avatar.png'
  },
  friends: Array,
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: String
  },
  lastLogin: Date
},
{
  timestamps: true
})

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function (next) {
  const SALT_FACTOR = 12
  if (!this.isModified('password')) return next()

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return next(err)

    bcrypt.hash(this.password, salt, null, (err, hash) => {
      if (err) return next(err)
      this.password = hash
      next()
    })
  })
})

module.exports = mongoose.model('User', UserSchema)
