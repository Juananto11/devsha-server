'use strict'

const {
  findAllUser,
  findUserToSession,
  findUserByName,
  findSuggestionsFriends,
  findProfileFriend,
  addFriend
} = require('./user')

const {
  getConversations,
  getConversation,
  newConversation,
  sendReply
} = require('./chat')

const {
  login,
  register,
  validateMail,
  activateAccount,
  forgotPassword,
  resetPassword,
  modifyData
} = require('./auth')

module.exports = {
  findAllUser,
  findUserToSession,
  findUserByName,
  findSuggestionsFriends,
  findProfileFriend,
  addFriend,
  getConversations,
  getConversation,
  newConversation,
  sendReply,
  login,
  register,
  validateMail,
  activateAccount,
  forgotPassword,
  resetPassword,
  modifyData
}
