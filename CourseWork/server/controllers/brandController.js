const {Brand, Device} = require('../models/models')
const ApiError = require('../error/ApiError')

class BrandController{
    async create(req, res){
        const {name} = req.body
        const brand = await Brand.create({name})
        return res.json(brand)
    }

    async getAll(req, res){
        const brands = await Brand.findAll()
        return res.json(brands)
    }

    async removeBrand(req, res) {
        const {name} = req.body;
        const brandId = (await Brand.findOne({where:{name}})).dataValues.id;
        await Device.destroy({where:{brandId}})
        const result = await Brand.destroy({where:{name}});
        return res.json(result);
    }

    async updateBrand(req, res) {
        const {oldName, newName} = req.body;
        const result = await Brand.update({name: newName}, {where: {name: oldName}});
        return res.json(result);
    }

}

module.exports = new BrandController()