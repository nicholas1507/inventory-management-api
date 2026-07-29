const {Op} = require('sequelize');
const {Supplier} = require('../models');

exports.getSuppliers = async(req,res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const search = (req.query.search || "").trim();
        const offset = (page - 1) * limit;
        const suppliers = await Supplier.findAll({
            where: search ? {name : { [Op.iLike] : `%${search}%` }} : {},
            offset,
            limit,
            order: [["id", "DESC"]]
        });
        const total = await Supplier.count({
            where: search ? {name : { [Op.iLike] : `%${search}%` }} : {}
        });
        res.status(200).json({
            data: suppliers,
            pagination: {
                page,
                limit,
                totalData: total,
                totalPage: Math.ceil(total/limit)
            }
        })
    }catch(error){
        res.status(500).json({
            error: `Internal server error!`
        })
    }
}
exports.createSupplier = async(req,res) => {
    try{
        const {name, address} = req.body;
        const suplier = await Supplier.create({name, address});
        res.status(201).json(suplier);
    }catch(error){
        res.status(500).json({
            error: `Internal server error!`
        })
    }
}
exports.updateSupplier = async(req,res) => {
    try{
        const id = req.params.id;
        const {name, address} = req.body;
        const supplier = await Supplier.findByPk(id);
        if(!supplier) return res.status(404).json({error: `Supplier not found!`});
        if(name !== undefined) supplier.name = name;
        if(address !== undefined) supplier.address = address;
        await supplier.save();
        res.status(200).json(supplier);
    }catch(error){
        res.status(500).json({
            error: `Internal server error!`
        })
    }
}
exports.deleteSupplier = async(req,res) => {
    try{
        const id = req.params.id;
        const supplier = await Supplier.findByPk(id);
        if(!supplier) return res.status(404).json({error: `Supplier not found!`});
        const movementCount = await supplier.countStockMovements();
        if(movementCount > 0){
            return res.status(400).json({error: `Supplier already used in stockMovement`})
        }
        await supplier.destroy();
        res.status(200).json(supplier);
    }catch(error){
        res.status(500).json({
            error: `Internal server error!`
        })
    }
}