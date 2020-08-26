const router = require('express').Router()
const controller = require('./controller')

router.get('/list', controller.fetchContactList)
router.post('/delete', controller.deleteContact)


module.exports = router