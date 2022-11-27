const {BasketDevice, Device} = require('../models/models')
const ApiError = require('../error/ApiError')

class BasketController{
    async create(req, res){
        const {deviceId, basketId} = req.body
        const basketDevice = await BasketDevice.create({basketId, deviceId})
        return res.json(basketDevice)
    }

    async getAll(req, res) {
        const {basketId} = req.body;
        let basketDevices = await BasketDevice.findAll({where:{basketId: basketId}});
        basketDevices = await Promise.all(basketDevices.map(async el => {
            const device = await Device.findOne({where: {id: el.deviceId}});
            device.dataValues.basketDeviceId = el.id;
            return device;
        }));
        return res.json(basketDevices);
    }

    async clearBasket(req, res) {
        const {basketId} = req.body;
        await BasketDevice.destroy({where:{basketId}});
    }

    async removeBasketItem(req, res) {
        const {basketDeviceId} = req.body;
        const result = await BasketDevice.destroy({where: {id: basketDeviceId}});
        return res.json(result);
    }

}

module.exports = new BasketController()