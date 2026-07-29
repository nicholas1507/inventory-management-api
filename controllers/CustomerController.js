const {Customer} = require('../models');
const {Op} = require('sequelize');

exports.getCustomers = async(req,res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const search = (req.query.search || "").trim();
        const offset = (page - 1) * limit
        const customer = await Customer.findAll({
            where: search ? {name: { [Op.iLike] : `%${search}%` }} : {},
            offset,
            limit,
            order: [["id", "DESC"]]
        });
        const total = await Customer.count({
            where: search ? {name : { [Op.iLike] : `%${search}%` }} : {}
        });
        res.status(200).json({
            data: customer,
            pagination: {
                page,
                limit,
                totalData: total,
                totalPage: Math.ceil(total/limit)
            }
        })
    }catch(err){
        res.status(500).json({
            error: `Internal server error!`
        })
    }
}
exports.createCustomer = async(req,res) => {
    try{
        const {name, address} = req.body;
        const customer = await Customer.create({name, address});
        res.status(201).json(customer);
    }catch(err){
        res.status(500).json({
            error: `Internal server error!`
        })
    }
}
exports.updateCustomer = async(req,res) => {
    try{
        const id = req.params.id;
        const {name, address} = req.body;
        const customer = await Customer.findByPk(id);
        if(!customer) return res.status(404).json({error: `Customer not found!`});
        if(name !== undefined){
            customer.name = name;
        }
        if(address !== undefined){
            customer.address = address;
        }
        await customer.save();
        res.status(200).json(customer);
    }catch(err){
        res.status(500).json({
            error: `Internal server error!`
        })
    }
}
exports.deleteCustomer = async(req,res) => {
    try{
        const id = req.params.id;
        const customer = await Customer.findByPk(id);
        if(!customer) return res.status(400).json({error: `Invalid customerId`});
        const movementCount = await customer.countStockMovements();
        if(movementCount > 0){
            return res.status(400).json({error: `Customer already used in stockMovement!`});
        }
        await customer.destroy();
        res.status(200).json(customer);
    }catch(err){
        res.status(500).json({error: `Internal server error!`});
    }
}