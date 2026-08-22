const { Op } = require('sequelize');
const { StockMovement,Product, sequelize, Supplier, Customer, User, StockRequest, StockRequestItems } = require('../models');
const { generateReferenceCode } = require('../utils/referenceCodeGenerator');

exports.getMovementsService = async(page,limit,search,type,startDate,endDate,maker,offset,isUser) => {
    try{
        const whereCondition = {};
        if(type){
            whereCondition.type = type;
        }
        if(search){
            whereCondition.referenceCode = { [Op.iLike]: `%${search}%` }
        }
        if(startDate && endDate && new Date(startDate) <= new Date(endDate)){
            whereCondition.createdAt = { [Op.between]: [startDate,endDate] }
        }
        if(maker === "Admin"){
            whereCondition.requestId = { [Op.is]: null }
        }
        if(maker === "User" || isUser){
            whereCondition.requestId = { [Op.not]: null }
        }
        const moves = await StockMovement.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id','name']
                },
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id','name','stock','minimumStock','productCode','unitId']
                },
                {
                    model: StockRequest,
                    as: 'stockRequest',
                    attributes: ['id','userId','status','processedBy','processedAt']
                },
                {
                    model: Customer,
                    as: 'customer',
                    attributes: ['id','name']
                },
                {
                    model: Supplier,
                    as: 'supplier',
                    attributes: ['id','name']
                }
            ],
            where: whereCondition,
            offset,
            limit,
            order: [['createdAt','DESC']]
        });
        const total = await StockMovement.count({
            where: whereCondition
        });
        return {success: true, data: moves,pagination: {page,limit,totalData: total, totalPage: Math.ceil(total/limit)}}
    }catch(error){
        console.error("Failed to get movements, error: ", error);
        throw error;
    }
}
exports.userActivityService = async(page,limit,search,offset) => {
    try{
        const whereCondition = {};
        if(search){
            whereCondition.name = { [Op.iLike]: `%${search}%` }
        }
        const countMov = await StockMovement.count({
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id","name"],
                    where: whereCondition
                }
            ]
        });
        const countReq = await StockRequest.count({
            include: [
                {
                    model: User,
                    as: "creator",
                    attributes: ["id","name"],
                    where: whereCondition
                }
            ]
        });
        let limitA = 0
        let limitB = 0
        let offsetB = 0
        if(offset < countMov){
            limitA = Math.min(limit,countMov - offset);
            limitB = limit - limitA;
        }else if(offset >= countMov){
            offsetB = offset - countMov;
            limitB = limit
        }
        const movements = await StockMovement.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id','name'],
                    where: whereCondition
                },
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id','name','stock','minimumStock','productCode','unitId']
                },
                {
                    model: Supplier,
                    as: "supplier"
                },
                {
                    model: Customer,
                    as: "customer"
                }
            ],
            offset,
            limit: limitA
        });
        const requests = await StockRequest.findAll({
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id','name'],
                    where: whereCondition
                },
                {
                    model: Product,
                    as: 'products',
                    attributes: ['id','name','stock','minimumStock','productCode','unitId']
                },
                {
                    model: Customer,
                    as: "customers"
                },
                {
                    model: StockRequestItems,
                    as: "requestItems",
                    include: [{model: Product, as: 'product'}]
                }
            ],
            offset: offsetB,
            limit: limitB
        });
        const total = countMov + countReq;
        return {
            success: true,
            data: {movements,requests},
            pagination: {
                page,
                limit,
                totalData: total,
                totalPage: Math.ceil(total/limit)
            }
        }
    }catch(error){
        console.error("Failed to load user Activity, error: ",error);
        throw error;
    }
}

exports.createMovementService = async(userId,items,supplierId,notes,customerId,type) => {
    const t = await sequelize.transaction();
    try{
        if(!Array.isArray(items) || items.length === 0 || !type){
            throw new Error("Items and type required!");
        }
        const productIds = items.map(item => item.productId);
        const products = await Product.findAll({where: {id: productIds}, transaction: t, lock: t.LOCK.UPDATE});
        if(productIds.length !== products.length || products.length === 0){
            throw new Error("Products not found!");
        }
        const map = new Map(
            products.map(product => [product.id,product])
        );
        const stockMovementItems = [];
        switch(type){
            case "IN" :
                const supplier = await Supplier.findByPk(supplierId,{transaction: t});
                if(!supplier){
                    throw new Error("Supplier not found!");
                }
                const referenceType = "PURCHASE";
                const referenceCode = generateReferenceCode("PO");
                for(const item of items){
                    const product = map.get(Number(item.productId));
                    const qty = parseInt(item.quantity);
                    if(qty <= 0 ){
                        throw new Error("Item quantity must be greater than 0!");
                    }
                    const stockBefore = parseInt(product.stock);
                    const stockAfter = stockBefore + qty;
                    stockMovementItems.push({
                        productId: product.id,
                        userId,
                        type: "IN",
                        quantity: qty,
                        supplierId,
                        stockBefore,
                        stockAfter,
                        referenceType,
                        referenceCode,
                        notes
                    });
                    product.stock = stockAfter;
                }
                const result = await StockMovement.bulkCreate(stockMovementItems, {transaction: t});
                for(const product of products){
                    await product.save({transaction: t});
                }
                await t.commit()
                return {success: true, result: result}
            case "OUT" :
                const customer = await Customer.findByPk(customerId,{transaction: t});
                if(!customer){
                    throw new Error("Customer not found!");
                }
                const outReferenceType = "SALE";
                const outReferenceCode = generateReferenceCode("SO");
                for(const item of items){
                    const product = map.get(Number(item.productId));
                    const qty = parseInt(item.quantity);
                    if(qty <= 0 ){
                        throw new Error("Item quantity must be greater than 0!")
                    }
                    const stockBefore = parseInt(product.stock);
                    if(stockBefore < qty){
                        throw new Error("Insufficient product stock!");
                    }
                    const stockAfter = stockBefore - qty;
                    stockMovementItems.push({
                        productId: product.id,
                        userId,
                        type: "OUT",
                        quantity: qty,
                        customerId,
                        stockBefore,
                        stockAfter,
                        referenceType: outReferenceType,
                        referenceCode: outReferenceCode,
                        notes
                    });
                    product.stock = stockAfter;
                }
                const outResult = await StockMovement.bulkCreate(stockMovementItems,{transaction: t});
                for(const product of products){
                    await product.save({transaction: t});
                }
                await t.commit();
                return {success: true, outMovement: outResult}
            default: 
                throw new Error("Invalid movement type!");
        }
    }catch(error){
        console.error("ERROR create movement : ",error);
        await t.rollback();
        throw error;
    }
}