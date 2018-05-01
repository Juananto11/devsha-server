'use strict'

const jwt = require('jsonwebtoken')
const crypto = require('crypto')
// const passport = require('passport')
const User = require('./../models/user')
const bcrypt = require('bcrypt-nodejs')
const { secret } = require('./../config')
// const { sendMailSMTP } = require('./../services/mailer')

// Login Route POST
exports.login = (req, res, next) => {
  User
    .findOne({ email: req.body.email })
    .then(user => {
      bcrypt.compare(req.body.password, user.password, (err, match) => {
        if (err) return console.log('error bcrypt', err)
        if (match) {
          res.status(201).json({
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
        } else {
          return res.status(200).json({ ok: false, message: 'Nombre de usuario o contraseña invalidos' })
        }
      })
    })
    .catch(err => {
      if (err) return res.status(200).json({ ok: false, message: 'Nombre de usuario o contraseña invalidos' })
    })
}

// Registration route POST
exports.register = (req, res) => {
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password

  // if (!username) return res.status(200).json({ok: false, message: 'Debes ingresar un Nombre de usuario'})
  // if (!email) return res.status(200).json({ok: false, message: 'Debes ingresar una dirección de correo electrónico'})
  // if (!password) return res.status(200).json({ok: false, message: 'Debes ingresar una contraseña'})

  User
    .findOne({ username })
    .then(existingUser => {
      if (existingUser) return res.status(200).json({ok: false, failed: 'username', message: 'Este nombre de Usuario ya existe'})
      User.findOne({ email })
        .then(existingEmail => {
          if (existingEmail) return res.status(200).json({ok: false, failed: 'email', message: 'Este correo electrónico ya existe'})

          const user = new User({
            username,
            email,
            password
          })

          user
            .save()
            .then(user => {
              // sendMailSMTP(user.email, user._id)
              res.status(201).json({
                ok: true,
                id: user._id
              })
            })
        })
    })
    .catch(err => console.log(err))
}

// Validate email POST
exports.validateMail = (req, res) => {
  User
    .find({_id: req.body.id})
    .then(user => {
      res.status(200).json({ok: true})
    })
    .catch(err => {
      if (err) res.status(200).send({ok: false, message: 'Tu solicitud no se pudo procesar intenta de nuevo por favor'})
    })
}

// Activated Account PATCH
exports.activateAccount = (req, res) => {
  User
    .update({_id: req.body.id}, {$set: {status: true}})
    .then(() => {
      User
        .findById(req.body.id)
        .then(user => {
          if (user.status) {
            res.status(201).json({
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
    })
    .catch(err => {
      if (err) res.status(200).send({ ok: false, message: 'Tu solicitud no se pudo procesar intenta de nuevo por favor' })
    })
}

// Modify Data of user PATCH
exports.modifyData = (req, res) => {
  const dataUser = jwt.decode(req.headers.token, secret)

  User
    .findByIdAndUpdate(dataUser._id, req.body)
    .then(result => {
      User
        .findById(result._id)
        .then(user => {
          res.status(201).json({
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
    .catch(err => {
      if (err) return res.status(200).json({ok: false, message: 'Tu solicitud no se pudo procesar intenta de nuevo por favor'})
    })
}

// Forgot Password Route
exports.forgotPassword = (req, res) => {
  const email = req.body.email

  User
    .findOne({ email }, (err, user) => {
      if (err || !user) {
        return res.status(200).json({ok: false, message: 'Tu solicitud no se pudo procesar intenta de nuevo por favor'})
      }

      crypto.randomBytes(48, (err, buffer) => {
        const resetToken = buffer.toString('hex')
        // if (err) return next(err)
        if (err) return res.status(200).json({ ok: false, message: 'No se pudo completar la petición' })

        user.resetPasswordToken = resetToken
        user.resetPasswordExpires = Date.now() + 3600000

        user
          .save(err => {
            // if (err) return next(err)
            if (err) return res.status(200).json({ ok: false, message: 'No se pudo completar la petición' })

            return res.status(200).json({message: 'Verifique su correo electrónico para ver el enlace y restablecer su contraseña.'})
          })
      })
    })
}

// Reset Password Route PATCH
exports.resetPassword = (req, res, next) => {
  let dataToken = jwt.decode(req.headers.token, secret)
  let oldPassword = req.body.oldPassword
  let newPassword = req.body.newPassword

  User
    .findById(dataToken._id)
    .then(result => {
      if (!result) return res.status(200).json({ ok: false, message: 'No se pudo completar la petición - 1' })
      if (result.status === false) return res.status(200).json({ ok: false, message: 'No se pudo completar la petición - 2' })

      bcrypt.compare(oldPassword, result.password, (err, match) => {
        if (err) return console.log('error bcrypt', err)
        if (match === true) {
          User
            .where({_id: result._id})
            .remove()
            .then(() => {
              const userWithNewPassword = new User({
                _id: result._id,
                status: result.status,
                username: result.username,
                email: result.email,
                password: newPassword,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt
              })

              userWithNewPassword
                .save()
                .then(user => {
                  return res.status(200).json({ok: true, changePassword: 'valid', message: 'Tu contraseña se cambio con exito'})
                })
                .catch(err => console.log(err))
            })
        } else {
          return res.status(200).json({ok: false, changePassword: 'invalid', message: 'Tu contraseña no coincide, no se pudo realizar el cambio'})
        }
      })
    })
    .catch(err => {
      if (err) console.log(err)
    })
}
