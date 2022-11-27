const {Type} = global.models;
const ApiError = require('../error/ApiError');
const {Brand, Device} = require("../models/models");

class TypeController{
    async create(req, res){
        const {name} = req.body
        const type = await Type.create({name});
        return res.json(type)
    }

    async getAll(req, res){
        const types = await Type.findAll()
        return res.json(types)
    }

    async removeType(req, res) {
        const {name} = req.body;
        const typeId = (await Type.findOne({where:{name}})).dataValues.id;
        await Device.destroy({where:{typeId}})
        const result = await Type.destroy({where:{name}});
        return res.json(result);
    }


    async updateType(req, res) {
        const {oldName, newName} = req.body;
        const result = await Type.update({name: newName}, {where: {name: oldName}});
        return res.json(result);
    }
}

module.exports = new TypeController()