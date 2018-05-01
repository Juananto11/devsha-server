'use strict'

const jwt = require('jsonwebtoken')
const { secret } = require('./../config')
const User = require('./../models/user')

exports.findUserToSession = (req, res, next) => {
  const decode = jwt.verify(req.headers.token, secret)

  User
    .findById(decode._id)
    .populate({
      path: 'friends',
      select: ['username', 'avatar', 'email', 'fullName']
    })
    .then(user => {
      if (!user.status) return res.status(200).json({ok: false, message: 'Cuanta de correo no verificada'})
      if (user.status) {
        return res.status(200).json({
          ok: true,
          username: user.username,
          email: user.email,
          _id: user._id,
          fullName: user.fullName,
          avatar: user.avatar,
          friends: user.friends,
          createdAt: user.createdAt,
          token: jwt.sign(
            {
              username: user.username,
              email: user.email,
              _id: user._id
            },
            secret,
            { expiresIn: 604800 }
          )
        })
      }
    })
    .catch(err => {
      console.log(err)
      if (err) return res.status(200).json({ok: false, message: 'Usuario no encontrado'})
    })
}

exports.findAllUser = (req, res, next) => {
  User
    .find({}, (err, users) => {
      if (err) {
        res.status(500).send({message: 'Error en la petición'})
        return next(err)
      }

      return res.status(200).json(users)
    })
}

exports.findUserByName = (req, res, next) => {
  const user = req.body.search

  User
    .find({name: new RegExp('^' + user)}, (err, user) => {
      if (err) {
        res.statu(500).send({message: 'Error en la petición'})
        next(err)
      }

      if (!user) {
        res.status(404).send({messages: 'No se obtuvo ningun resultado'})
        next(err)
      }

      return res.status(200).json(user)
    })
}

exports.findSuggestionsFriends = (req, res) => {
  const dataToken = jwt.verify(req.headers.token, secret)

  User
    .findById(dataToken._id)
    .then(result => {
      let knownUsers = [dataToken._id]

      result.friends.forEach(friend => {
        knownUsers.push(friend.toString())
      })

      User
        .find({})
        .then(results => {
          let unknownUsers = []
          let suggestedFriends = []

          results.forEach((el) => {
            if (!knownUsers.includes(el._id.toString())) {
              unknownUsers.push(el)
            }
          })
          let long = unknownUsers.length
          for (let i = 0; i < long; i++) {
            let random = Math.floor(Math.random() * (unknownUsers.length))
            suggestedFriends.push({
              username: unknownUsers[random].username,
              email: unknownUsers[random].email,
              _id: unknownUsers[random]._id,
              avatar: unknownUsers[random].avatar
            })

            unknownUsers.splice(random, 1)

            if (suggestedFriends.length > 4) {
              break
            }
          }
          return res.status(200).send(suggestedFriends)
        })
    })
}

exports.findProfileFriend = (req, res) => {
  User
    .findOne({username: req.body.id})
    .populate({
      path: 'friends',
      select: ['username', 'avatar', 'email', 'fullName']
    })
    .then(user => {
      return res.status(200).json({
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar,
        createdAt: user.createdAt,
        email: user.email,
        friends: user.friends,
        _id: user._id
      })
    })
    .catch(err => console.log(err))
}

exports.addFriend = (req, res) => {
  const dataToken = jwt.verify(req.headers.token, secret)

  User
    .findById(dataToken._id)
    .then(result => {
      let friends = result.friends
      if (!friends.includes(req.body.idFriend)) {
        friends.push(req.body.idFriend)
        User
          .update({_id: dataToken._id}, {$set: {friends}})
          .then(() => {
            User
              .findById(dataToken._id)
              .then(user => {
                console.log('final', user.friends)
                return res.status(200).json({
                  ok: true,
                  username: user.username,
                  email: user.email,
                  _id: user._id,
                  fullName: user.fullName,
                  avatar: user.avatar,
                  friends: user.friends,
                  createdAt: user.createdAt,
                  token: jwt.sign(
                    {
                      username: user.username,
                      email: user.email,
                      _id: user._id
                    },
                    secret,
                    { expiresIn: 604800 }
                  )
                })
              })
          })
      }
    })
    .catch(err => console.log(err))
}
