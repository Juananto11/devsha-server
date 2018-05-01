'use strict'

module.exports = {
  secret: 'super_secret_devsha',
  database: 'mongodb://localhost:27017/devsha',
  // database: 'mongodb://juananto11:aria1703@ds241039.mlab.com:41039/devsha',
  port: process.env.PORT || 4000,
  testPort: 4001,
  testDb: 'devsha',
  testEnv: 'test',
  nodemailerSMTP: {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'juananto111@gmail.com',
      pass: 'aria1703'
    }
  },
  // nodemailerIMAP: {
  //   host: 'imap.ethereal.email',
  //   port: 993,
  //   auth: {
  //     user: 'kn77xdmn2inzugpg@ethereal.email',
  //     pass: 'GYnCyddHMREaYE7pDf'
  //   }
  // },
  // nodemailerPOP3: {
  //   host: 'pop3.ethereal.email',
  //   port: 995,
  //   auth: {
  //     user: 'kn77xdmn2inzugpg@ethereal.email',
  //     pass: 'GYnCyddHMREaYE7pDf'
  //   }
  // },
  mailOptions: (to, url) => ({
    from: `"Team devsha" <team@devsha.com>`,
    to: to,
    subject: 'Verifica tu cuenta de correo',
    text: 'Hola esperamos te encuentres bien, solo te molestamos para que validez tu cuenta de devsha',
    html: '<img src="" alt="Logo devsha">' +
    '<p>Hola esperamos te encuentres bien, solo te molestamos para que validez tu cuenta de devsha</p>' +
    '<p>Soló da click en las siguiente liga: <a href="http://localhost:8080/validate/' + url + '">http://localhost:8080/validate/' + url + '</a></p>'
  })
}
