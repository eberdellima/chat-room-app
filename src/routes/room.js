const RoomController = require('../controllers/room')
const router = require('express').Router()
const { logError } = require('zippy-logger')

router.get('/:user_id', async (req, res) => {
  try {

    const user_id = req.params.user_id
    const result = await new RoomController().index(user_id)
    res.send(result)

  } catch(err) {
    logError({ message: err, path: 'Room routes, get /user_id, global catch'})
    res.send(err)
  }
})

router.post('/', async (req, res) => {
  try {

    const data = {
      room_name: req.body.room_name,
      participants: req.body.participants,
      created_by_user: req.body.user_id
    }

    const result = await new RoomController().create(data)
    res.send(result)

  } catch(err) {
    logError({ message: err, path: 'Room routes, post /, global catch'})
    res.send(err)
  }
})

router.get('/:user_id/:room_id', async (req, res) => {
  try {

    const data = {
      user_id: req.params.user_id,
      room_id: req.params.room_id
    }

    const result = await new RoomController().get(data)
    req.send(result)

  } catch(err) {
    logError({ message: err, path: 'Room routes, get /user_id/room_id, global catch'})
    res.send(err)
  }
})

router.delete('/', async (req, res) => {
  try {

    const data = {
      room_id: req.body.room_id,
      user_id: req.body.user_id
    }

    const result = await new RoomController().remove(data)
    res.send(result)

  } catch(err) {
    logError({ message: err, path: 'Room routes, delete /, global catch'})
    res.send(err)
  }
})

module.exports = router