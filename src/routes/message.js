const MessageController = require('../controllers/message')
const router = require('express').Router()
const { logError } = require('zippy-logger')

router.get('/:user_id/:room_id', async (req, res) => {
  try {

    const data = {
      room_id: req.params.room_id,
      user_id: req.params.user_id
    }
  
    const result = await new MessageController().index(data)
  
    res.send(result)

  } catch(err) {
    logError({ message: err, path: 'Message route, get /user_id/room_id, global catch'})
    res.send(err)
  }
})

router.post('/', async (req, res) => {
  try {
    const data = {
      room_id: req.body.room_id,
      user_id: req.body.user_id,
      body: req.body.message
    }

    const result = await new MessageController().create(data)

    res.send(result)

  } catch(err) {
    logError({ message: err, path: 'Message controller, post /, global catch'})
    res.send(err)
  }
})

module.exports = router