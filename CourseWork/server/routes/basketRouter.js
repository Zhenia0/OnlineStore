const Router = require('express')
const router = new Router()
const basketController = require('../controllers/basketController')

router.post('/', basketController.create)
router.post('/items', basketController.getAll)
router.post('/sendOrder', basketController.clearBasket)
router.post('/removeItem', basketController.removeBasketItem)

module.exports = router;