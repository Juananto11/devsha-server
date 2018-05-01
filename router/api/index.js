'use strict'

const express = require('express')
const controller = require('./../../controllers')

module.exports = (app) => {
  const apiRoutes = express.Router()
  const authRoutes = express.Router()
  const userRoutes = express.Router()
  const chatRoutes = express.Router()
  const searchRoutes = express.Router()

  app.use('/api', apiRoutes)

  apiRoutes.use('/auth', authRoutes)
  apiRoutes.use('/chat', chatRoutes)
  apiRoutes.use('/search', searchRoutes)
  apiRoutes.use('/user', userRoutes)

  authRoutes.post('/login', controller.login)
  authRoutes.post('/register', controller.register)
  authRoutes.post('/forgot-password/:id', controller.forgotPassword)
  authRoutes.post('/validate/:id', controller.validateMail)
  authRoutes.post('/reset-password', controller.resetPassword)
  authRoutes.post('/activate/:id', controller.activateAccount)
  authRoutes.post('/modify-data', controller.modifyData)

  chatRoutes.get('/', controller.getConversations)
  chatRoutes.get('/:conversationId', controller.getConversation)
  chatRoutes.post('/:conversationId', controller.sendReply)
  chatRoutes.post('/new/:recipient', controller.newConversation)

  searchRoutes.get('/search', controller.findUserByName)

  // userRoutes.get('/', controller.findAllUser)
  // userRoutes.get('/:userId', controller.findUserById)
}
