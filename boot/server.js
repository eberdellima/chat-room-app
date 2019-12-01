const helmet = require('helmet')
const cors = require('cors')
const bodyParser = require('body-parser')

module.exports = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(cors())
  app.use(helmet())
}