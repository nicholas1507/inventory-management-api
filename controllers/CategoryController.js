const { Op } = require('sequelize');
const { Category, Product } = require('../models');

exports.getCategories = async (req,res) => {
    try{
        const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;
            const search = (req.query.search || "").trim();
            const offset = (page - 1) * limit;
            const categories = await Category.findAll({
                include: [{model: Product, as: "products", attributes: ['id','name','productCode']}],
                where: search ? {name: { [Op.iLike]: `%${search}%` }} : {},
                limit,
                offset
            });
            const total = await Category.count({
                where: search ? {name: {  [Op.iLike]: `%${search}%` }} : {}
            });
            res.status(200).json({
                data: categories,
                pagination: {
                    page,
                    limit,
                    totalData: total,
                    totalPage: Math.ceil(total/limit)
                }
            });
    }catch(error){
        console.error("Error categories", error);
        res.status(500).json({
            error: error.message || "Internal server error!"
        })
    }
}
exports.getCategoryById = async(req,res) => {
    try{
        const id = req.params.id;
        const category = await Category.findByPk(id);
        if(!category) return res.status(404).json({error: `Category not found!`});
        res.status(200).json(category);
    }catch(error){
        console.error("Error category", error);
        res.status(500).json({
            error: error.message || "Internal server error!"
        })
    }
}
exports.createCategory = async(req,res) => {
    try{
        const {name} = req.body;
        const cat = await Category.create({name})
        res.status(200).json(cat);
    }catch(err){
        res.status(500).json(err);
    }
}
exports.updateCategory = async(req,res) => {
    try{
        const id = req.params.id;
        const {name} = req.body;
        const [updated] = await Category.update({name},{where: {id}});
        if(!updated) return res.status(404).json({error: `Failed to update cat id ${id}`});
        res.status(200).json(updated);
    }catch(err){
        res.status(500).json(err); 
    }
}
exports.deleteCategory = async(req,res) => {
    try{
        const id = req.params.id;
        const cat = await Category.destroy({where: {id}});
        if(!cat) return res.status(404).json({error: `Failed to delete`});
        res.status(200).json(cat);
    }catch(err){
        res.status(200).json(err);
    }
}