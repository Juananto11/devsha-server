'use strict'

const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')
const User = require('./../../models').User
const { secret } = require('./../index')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

// Setting up local login strategy
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) return done(err, false, {error: 'Tu solicitud no se pudo procesar intenta de nuevo por favor'})
      if (!user) return done(null, false, {error: 'Sus datos de acceso no pudieron ser verificados. Inténtalo de nuevo'})

      user.comparePassword(password, (err, isMatch) => {
        if (err) return done(err, false, {error: 'Tu solicitud no se pudo procesar intenta de nuevo por favor'})
        if (!isMatch) return done(null, false, {error: 'Sus datos de acceso no pudieron ser verificados. Inténtalo de nuevo'})

        return done(null, user)
      })
    })
  })
)

// Setting JWT strategy options
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret
}

// Setting up JWT login strategy
passport.use(
  new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload._id, (err, user) => {
      if (err) return done(err, false)

      if (user) {
        return done(null, user)
      } else {
        done(null, false)
      }
    })
  })
)
