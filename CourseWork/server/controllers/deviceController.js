const uuid = require('uuid')
const path = require('path');
const {Device, DeviceInfo, BasketDevice} = require('../models/models')
const ApiError = require('../error/ApiError')
const {isIdNumber} = require('../lib/validation');

class DeviceController {
    async create(req, res, next) {
        try {
            let {name, price, brandId, typeId, info} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const device = await Device.create({name, price, brandId, typeId, img: fileName});

            if (info) {
                info = JSON.parse(info)
                info.forEach(i =>
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                )
            }

            return res.json(device)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        let {brandId, typeId, limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let devices;
        if (!brandId && !typeId) {
            devices = await Device.findAndCountAll({limit, offset})
        }
        if (brandId && !typeId) {
            devices = await Device.findAndCountAll({where: {brandId}, limit, offset})
        }
        if (!brandId && typeId) {
            devices = await Device.findAndCountAll({where: {typeId}, limit, offset})
        }
        if (brandId && typeId) {
            devices = await Device.findAndCountAll({where: {typeId, brandId}, limit, offset})
        }
        return res.json(devices)
    }

    async getOne(req, res, next) {
        const {id} = req.params
        if (!isIdNumber(id)) {
            return next(ApiError.badRequest('Id девайса должен быть числом'));
        }
        const device = await Device.findOne(
            {
                where: {id},
                include: [{model: DeviceInfo, as: 'info'}]
            },
        )
        if (!device) {
            return next(ApiError.badRequest('Девайс не найден'));
        }
        return res.json(device)
    }

    async removeDevice(req, res) {
        const {deviceId} = req.body;
        await BasketDevice.destroy({where: {deviceId}});
        await Device.destroy({where: {id: deviceId}});
    }

    async updateDevice(req, res, next) {
        try {
            let {name, price, typeId, brandId, info, newName} = req.body
            console.log(newName);
            let img;
            const paramsToUpdate = {
                name
            };
            if (+brandId) {
                paramsToUpdate.brandId = req.body.brandId;
            }
            if (+typeId) {
                paramsToUpdate.typeId = typeId;
            }
            if (+price) {
                paramsToUpdate.price = price;
            }
            if (newName !== '') {
                paramsToUpdate.name = newName;
            }
            if (req.files) {
                img = req.files.img;
                let fileName = uuid.v4() + ".jpg"
                img.mv(path.resolve(__dirname, '..', 'static', fileName))
                paramsToUpdate.img = fileName;
            }

            const device = await Device.findOne({where:{name}});
            const isUpdated = (await Device.update(paramsToUpdate, {where: {name}}))[0];
            if (info && !!isUpdated && device) {
                info = JSON.parse(info)
                const infoUpdating = info.map(i => {
                    return DeviceInfo.update({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    }, {where: {title: i.title}})

                });
                const updatedNum = await Promise.all(infoUpdating);
                for (let i = 0; i < updatedNum.length; i++) {
                    if (updatedNum[i][0] === 0) {
                        await DeviceInfo.create({
                            title: info[i].title,
                            description: info[i].description,
                            deviceId: device.id
                        })
                    }
                }
            }

            return res.json(device)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new DeviceController()