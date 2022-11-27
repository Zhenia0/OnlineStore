const Router = require('express')
const router = new Router()
const brandController = require('../controllers/brandController')

router.post('/', brandController.create)
router.get('/', brandController.getAll)
router.delete('/', brandController.removeBrand)
router.put('/', brandController.updateBrand)

module.exports = router