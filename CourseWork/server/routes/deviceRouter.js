const Router = require('express')
const router = new Router()
const deviceController = require('../controllers/deviceController')

router.post('/', deviceController.create)
router.get('/', deviceController.getAll)
router.get('/:id', deviceController.getOne)
router.post('/removeDevice', deviceController.removeDevice)
router.put('/', deviceController.updateDevice)

module.exports = router