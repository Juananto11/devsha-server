const mongoose = require('mongoose')
const { port, database } = require('./config')
const server = require('./app')

mongoose.Promise = global.Promise

mongoose
  .connect(database)
  .then(() => {
    console.log('La conexción a la base de datos devsha se a realizado correctamente')

    server.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`)
    })
  })
  .catch(err => console.log(err))
