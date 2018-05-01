'use strict'

const nodemailer = require('nodemailer')

const { nodemailerSMTP, mailOptions } = require('./../config')

exports.sendMailSMTP = (to, userId) => {
  nodemailer.createTestAccount((err, account) => {
    if (err) return console.log(err)

    const transporter = nodemailer.createTransport(nodemailerSMTP)
    transporter.sendMail(mailOptions(to, userId), (err, info) => {
      if (err) return console.log(err)

      console.log(`Email enviado ${info.messageId}`)
    })
  })
}

// exports.sendMailIMAP = (to, userId) => {
//   nodemailer.createTestAccount((err, accunt) => {
//     if (err) return console.log(err)

//     const transporter = nodemailer.createTransport(nodemailerIMAP)
//     transporter.sendMail(mailOptions(to, userId), (err, info) => {
//       if (err) return console.log(err)

//       console.log(`Email enviado ${info.messageId}`)
//       console.log(`Vista previa URL ${nodemailer.getTestMessageUrl(info)}`)
//     })
//   })
// }

// exports.sendMailPOP3 = (to, userId) => {
//   nodemailer.createTestAccount((err, accunt) => {
//     if (err) return console.log(err)

//     const transporter = nodemailer.createTransport(nodemailerPOP3)
//     transporter.sendMail(mailOptions(to, userId), (err, info) => {
//       if (err) return console.log(err)

//       console.log(`Email enviado ${info.messageId}`)
//       console.log(`Vista previa URL ${nodemailer.getTestMessageUrl(info)}`)
//     })
//   })
// }
