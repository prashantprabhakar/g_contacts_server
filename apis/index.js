const router = require('express').Router()

const ContactRoute = require('./contacts')

router.get('/ping', (req, res) => res.json({message: 'Pong'}))
router.use('/contacts', ContactRoute)

module.exports = router