'use strict'

const express = require('express')
const controller = require('./../../controllers')

module.exports = (app) => {
  const home = express.Router()
  const user = express.Router()

  app.use('/', home)
  app.use('/user', user)

  home.get('/', controller.findUserToSession)
  home.get('/find-suggestions-friends', controller.findSuggestionsFriends)
  home.post('/profile/:id', controller.findProfileFriend)

  user.post('/add-friend', controller.addFriend)
}
