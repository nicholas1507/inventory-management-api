const {getProductsService, createProductService, updateProductService, getProductStockService, deleteProductService, getProductById} = require('../services/ProductService');

exports.getProducts = async(req,res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = (req.query.search || "").trim();
        const offset = (page - 1) * limit;
        const result = await getProductsService(page,limit,offset,search)
        res.status(200).json({
            data: result.data,
            pagination: result.pagination
        });
    }catch(error){
        res.status(500).json({
            error: error.message
        });
    }
}
exports.getProductById = async(req,res) => {
    try{
        const id = req.params.id;
        const product = await getProductById(id);
        res.status(200).json({
            success: product.success,
            data: product.data
        });
    }catch(error){
        res.status(500).json({
            error: error.message
        });
    }
}
exports.create = async(req,res) => {
    try{
        const {name, minimumStock, description, price, productCode, unitId,categoryId} = req.body;
        let fileData = null;
        if(req.file){
            fileData = {
                imagePublicId: req.file.filename || req.file.public_id,
                imageURL: req.file.path
            }
        }
        const result = await createProductService(name,minimumStock,description,price,productCode,unitId,categoryId,fileData);
        res.status(201).json({
            succes: result.success,
            message: `Product successfully created!`,
            data: result.data
        });
    }catch(error){
        console.error("ERROR", error);
        res.status(500).json({
            error: error.message
        });
    }
}
exports.update = async(req,res) => {
    try{
        const id = req.params.id;
        const allowedFields = ["name", "price", 'description', 'minimumStock', 'unitId', 'categoryId'];
        const updateData = {};
        allowedFields.forEach(field => {
            if(req.body[field] !== undefined){
                updateData[field] = req.body[field]
            }
        });
        let fileData = null;
        if(req.file){
            fileData = {
                imagePublicId: req.file.filename || req.file.public_id,
                imageURL: req.file.path
            }
        }
        const result = await updateProductService(id,updateData,fileData);
        res.status(200).json({
            success: result.success,
            data: result.data,
            message: result.message
        });
    }catch(error){
        console.error("Failed update Controller",error);
        res.status(500).json({
            error: error.message
        });
    }
}
exports.getProductStock = async(req,res) => {
    try{
        const {filterType, page = 1, limit = 10, search} = req.body;
        const offset = (page-1) * limit;
        const result = await getProductStockService(filterType,page,limit,offset,search);
        res.status(200).json({
            success: result.success,
            data: result.data,
            pagination: result.pagination
        })
    }catch(error){
        res.status(500).json({
            error: error.message
        });
    }
}
exports.delete = async(req,res) => {
    try{
        const id = req.params.id;
        const result = await deleteProductService(id);
        res.status(200).json({
            success: result.success,
            message: result.message
        });
    }catch(error){
        res.status(500).json({
            error: error.message
        });
    }
}    