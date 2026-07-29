const {Op} = require('sequelize');
const {Unit, Product} = require('../models');

exports.getUnits = async(req,res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const search = (req.query.search || "").trim();
        const offset = (page - 1) * limit;
        const units = await Unit.findAll({
            include: [{model: Product, as:"products", attributes: ["name", "stock", "productCode"]}],
            where: search ? {name: { [Op.iLike]: `%${search}%` }} : {},
            offset,
            limit
        });
        const total = await Unit.count({
            where: search ? {name: { [Op.iLike]: `%${search}%` }} : {}
        });
        res.status(200).json({
            data: units,
            pagination: {
                page,
                limit,
                totalData: total,
                totalPage: Math.ceil(total/limit)
            }
        })
    }catch(error){
        res.status(500).json({error: `Internal server error!`});
    }
}
exports.createUnit = async(req,res) => {
    try{
        const {name, abbreviation} = req.body;
        const unit = await Unit.create({name, abbreviation});
        res.status(201).json(unit);
    }catch(error){
        console.error("Unit error: ", error)
        res.status(500).json({
            error: `Internal server error!`
        })
    }
}
exports.updateUnit = async(req,res) => {
    try{
        const id = req.params.id;
        const {name, abbreviation} = req.body;
        const unit = await Unit.findByPk(id);
        if(!unit) return res.status(404).json({error: `Unit not found!`});
        if(name !== undefined) unit.name = name;
        if(abbreviation !== undefined) unit.abbreviation = abbreviation;
        await unit.save();
        res.status(200).json(unit);
    }catch(error){
        res.status(500).json({
            error: `Internal server error!`
        })
    }
}
exports.deleteUnit = async(req,res) => {
    try{
        const id = req.params.id;
        const unit = await Unit.findByPk(id);
        if(!unit) return res.status(404).json({error: `Unit not found!`});
        const productCount = await unit.countProducts();
        if(productCount > 0){
            return res.status(400).json({error: `Unit already used in products!`});
        }
        await unit.destroy();
        res.status(200).json({
            message: `Unit deleted successfully!`
        })
    }catch(error){
        res.status(500).json({
            error: `Internal server error!`
        })
    }
}