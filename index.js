const app = require('./boot/app')
const port = process.env.PORT
const { logError } = require('zippy-logger')

const startServer = async () => {
  try {
    app.listen(port, () => { console.log(`Listening on port: ${port}`) })
  } catch(err) {
    logError({ message: err, path: 'Initializing app' })
  }
}

startServer()