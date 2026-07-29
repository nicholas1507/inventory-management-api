const { Op } = require('sequelize');
const {Product, Category, Unit, sequelize} = require('../models');
const { cloudinary } = require('../middleware/upload');

exports.getProductsService = async(page,limit,offset,search) => {
    try{
        const whereCondition = {};
        if(search){
            whereCondition.name = { [Op.iLike]: `%${search}%` }
        }
        const products = await Product.findAll({
            include: [
                {model: Category, as: 'category'},
                {model: Unit, as: 'unit'}
            ],
            where: whereCondition,
            limit,
            offset
        });
        const total = await Product.count({
            where: whereCondition
        });
        return {
            success: true,
            data: products,
            pagination: {
                page,
                limit,
                totalData: total,
                totalPage: Math.ceil(total/limit)
            }
        }
    }catch(error){
        console.error("Failed to load products, error: ",error);
        throw error;
    }
}
exports.getProductStockService = async(filterType,page,limit,offset,search) => {
    try{
        const whereCondition = {};
        if(filterType === "EMPTY"){
            whereCondition.stock = 0
        }
        if(filterType === "LOW"){
            whereCondition.stock = { [Op.lt]: sequelize.col('minimumStock') }
        }
        if(search){
            whereCondition.name = { [Op.iLike]: `%${search}%` }
        }
        const products = await Product.findAndCountAll({
            where: whereCondition,
            limit,
            offset
        });
        return {
            success: true,
            data: products.rows,
            pagination: {
                page,
                limit,
                totalData: products.count,
                totalPage: Math.ceil(products.count/limit)
            }
        }
    }catch(error){
        console.error("Failed to get stock product!");
        throw error;
    }
}
exports.getProductById = async(id) => {
    try{
        const product = await Product.findByPk(id,{
            include: [
                {model: Category, as: "categories"},
                {model: Unit, as: "unit"}
            ]
        });
        if(!product) throw new Error("Product not found!");
        return{
            success: true,
            data: product
        }
    }catch(error){
        console.error("Failed to get product, error: ", error);
        throw error;
    }
}
exports.createProductService = async(name,minimumStock,description,price,productCode,unitId,categoryId,fileData) => {
    try{
        if(!name || !minimumStock || !price || !productCode || !unitId || !categoryId){
            throw new Error("Missing required fields!");
        }
        const category = await Category.findByPk(categoryId);
        if(!category) throw new Error("Category not found!");
        const unit = await Unit.findByPk(unitId);
        if(!unit) throw new Error("Unit not found!");
        if(!fileData) throw new Error("Image data null");
        const imagePublicId = fileData.imagePublicId;
        const imageURL = fileData.imageURL
        const product = await Product.create({
            name,
            minimumStock,
            description,
            price,
            productCode,
            imageURL,
            imagePublicId,
            unitId,
            categoryId
        });
        return {
            success: true,
            data: product
        }
    }catch(error){
        console.error("Failed to create product, error: ",error);
        throw error;
    }
}
exports.updateProductService = async(id,updateData,fileData) => {
    try{
        const product = await Product.findByPk(id);
        if(!product) throw new Error("Product not found!");
        if(updateData.categoryId){
            const category = await Category.findByPk(updateData.categoryId);
            if(!category) throw new Error("Category not found!");
        }
        if(updateData.unitId){
            const unit = await Unit.findByPk(updateData.unitId);
            if(!unit) throw new Error("Unit not found!");
        }
        const oldImage = product.imagePublicId;
        if(fileData){
            updateData.imagePublicId = fileData.imagePublicId;
            updateData.imageURL = fileData.imageURL
        }
        await product.update(updateData);
        if(oldImage && fileData){
            await cloudinary.uploader.destroy(oldImage);
        }
        return {
            success: true,
            data: product,
            message: "Updated product successfully!"
        }
    }catch(error){
        console.error("Failed to update product, error: ", error);
        throw error;
    }
}
exports.deleteProductService = async(id) => {
    try{
        const product = await Product.findByPk(id);
        if(!product) throw new Error("Product not found!");
        const movements = await product.countStockMovements();
        const requestItems = await product.countRequestItems();
        if(movements > 0 || requestItems > 0){
            throw new Error("Product already used in transaction!");
        }
        await product.destroy();
        return {
            success: true,
            message: `Product with id ${id} has been deleted!`
        }
    }catch(error){
        console.error("Failed to delete product, error: ",error);
        throw error;
    }
}