const { Op } = require('sequelize');
const {StockRequest, StockMovement, StockRequestItems, sequelize, Product, Customer, User} = require('../models');
const {generateReferenceCode} = require('../utils/referenceCodeGenerator');

exports.getStockRequestsService = async(page,limit,search,offset,status) => {
    try{
        const whereCondition = {};
        if(search){
            whereCondition[`$customers.name$`] = { [Op.iLike]: `%${search}%` }
        }
        if(status){
            whereCondition.status = status;
        }
        const requests = await StockRequest.findAll({
            include: [
                {
                    model: StockRequestItems, 
                    as: 'requestItems',
                    attributes: ["id","productId","requestId","quantity"]
                },
                {
                    model: Product, 
                    as: "products", 
                    attributes: ['id','name','stock','minimumStock','productCode','unitId']
                },
                {
                    model: StockMovement, 
                    as:"stockMovements", 
                    attributes: ['productId','userId','type','customerId','quantity','requestId']
                },
                {
                    model: Customer,
                    as: "customers",
                    attributes: ["id","name"],
                    required: true
                },
                {
                    model: User,
                    as: "creator",
                    attributes: ["id","name"]
                },
                {
                    model: User,
                    as: "processor",
                    attributes: ["id","name"]
                }
            ],
            where: whereCondition,
            offset,
            limit
        });
        const total = await StockRequest.count({
            include: [
                {model: Customer, as: "customers", attributes: ["id","name"]}
            ],
            where: whereCondition
        });
        return {
            success: true,
            data: requests,
            pagination: {
                page,
                limit,
                totalData: total,
                totalPage: Math.ceil(total/limit)
            }
        }
    }catch(error){
        console.error("Failed to load stock requests, error: ", error);
        throw error;
    }
}
exports.getRequestById = async(id) => {
    try{
        const request = await StockRequest.findByPk(id,{
            include: [
                {
                    model: StockRequestItems, 
                    as: "requestItems"
                },
                {
                    model: Product,
                    as: "product",
                    attributes: ['id','name','stock','minimumStock','productCode','unitId']
                }
            ]
        });
        if(!request) throw new Error("Request not found!");
        return {
            success: true,
            data: request,
            message: `Get request id success!`
        }
    }catch(error){
        console.error("Failed to get request, error: ",error);
        throw error;
    }
}
exports.createRequestService = async(userId,items,customerId) => {
    const t = await sequelize.transaction();
    try{
        if(!items || items.length ===  0){
            throw new Error("Items cannot be empty!");
        }
        const productIds = items.map(item => item.productId);
        const countProducts = await Product.count({where: {id: productIds},transaction: t});
        if(productIds.length !== countProducts){
            await t.rollback();
            throw new Error("Products not found or some products is missing!");
        }
        const customer = await Customer.findByPk(customerId,{transaction: t});
        if(!customer){
            await t.rollback();
            throw new Error("Customer not found!");
        }
        const request = await StockRequest.create({userId,status: "PENDING",customerId},{transaction: t});
        const requestItems = [];
        for(const item of items){
            const qty = parseInt(item.quantity);
            if(qty <= 0){
                throw new Error("Item quantity must be greater than 0!");
            }
            requestItems.push({
                productId: item.productId,
                requestId: request.id,
                quantity: qty
            });
        }
        await StockRequestItems.bulkCreate(requestItems,{transaction: t});
        await t.commit();
        const fullRequest = await StockRequest.findByPk(request.id,{
            include: [
                {model: StockRequestItems, as:"requestItems"},
                {model: User,as: "creator",attributes: ["id","name"]}
            ]
        })
        return {success: true,request: fullRequest}

    }catch(error){
        await t.rollback();
        throw error;
    }
}
exports.approvedRequestService = async(requestId,userId) => {
    const t = await sequelize.transaction();
    try{
        const stockRequest = await StockRequest.findByPk(requestId,{
            transaction: t,
            lock: t.LOCK.UPDATE
        });
        const requestItems = await StockRequestItems.findAll({where: {requestId: requestId}, transaction: t, lock: t.LOCK.UPDATE})
        if(!stockRequest || requestItems.length === 0){
            await t.rollback();
            throw new Error(`Stock Request Items is empty`);
        }
        if(stockRequest.status !== "PENDING"){
            await t.rollback();
            throw new Error(`Stock request cannot be processed!`);
        }
        const customerId = stockRequest.customerId;
        const customer = await Customer.findByPk(customerId,{transaction: t});
        if(!customer) {
            throw new Error("Customer not found!");
        }

        const items = requestItems;
        const productIds = items.map(i => i.productId);
        const products = await Product.findAll({where: {id: productIds}, transaction:t,lock: t.LOCK.UPDATE});
        if(products.length !== productIds.length || products.length === 0){
            await t.rollback();
            throw new Error(`All products not found or some product not found`)
        }
        const map = new Map(
            products.map(p => [p.id,p])
        )
        const referenceType = "SALE";
        const referenceCode = generateReferenceCode("SO");
        const stockMovementItems = [];
        for(const item of items){
            const product = map.get(Number(item.productId));
            if(!product){
                throw new Error("Product not found!");
            }
            const qty = parseInt(item.quantity);
            if(qty <= 0){
                throw new Error("Item quantity must be greater than 0!");
            }
            const stockBefore = Number(product.stock);
            if(stockBefore < qty){
                await t.rollback();
                throw new Error("Insufficient product stock!");
            }
            const stockAfter = stockBefore - qty;
            stockMovementItems.push({
                productId: product.id,
                userId: userId,
                type: "OUT",
                quantity: qty,
                customerId: customerId,
                requestId: requestId,
                stockBefore,
                stockAfter,
                referenceType,
                referenceCode,
                notes: "ACCEPTED"
            });
            product.stock = stockAfter;
        }
        const movement = await StockMovement.bulkCreate(stockMovementItems,{transaction: t});
        for(const product of products){
            await product.save({transaction: t});
        }
        await stockRequest.update({
            status: "APPROVED",
            processedBy: userId,
            processedAt: new Date(),
        },{transaction: t});
        await t.commit();
        return {success: true, referenceCode,movements: movement}
    }catch(error){
        await t.rollback();
        throw  error
    }
}
exports.cancelRequestService = async(id) => {
    const t = await sequelize.transaction();
    try{
        const request = await StockRequest.findByPk(id,{
            transaction: t,
            lock: t.LOCK.UPDATE
        });
        if(!request){
            await t.rollback();
            throw new Error("Stock request not found!");
        }
        if(request.status !== "PENDING"){
            await t.rollback();
            throw new Error("Stock request cannot be cancelled!");
        }
        await request.update({
            status: "CANCELLED"
        },{transaction: t});
        await t.commit();
        return {success: true, message: "Request Cancelled!"}
    }catch(error){
        await t.rollback();
        throw error;
    }
}
exports.rejectRequestService = async(id,userId) => {
    try{
        const result = await sequelize.transaction(async(t) => {
            const processedAt = new Date();
            const request = await StockRequest.findByPk(id, {transaction: t, lock: t.LOCK.UPDATE});
            if(!request){
                throw new Error("Stock request not found!");
            }
            if(request.status !== "PENDING"){
                throw new Error("Stock request cannot be rejected!");
            }
            await request.update({
                status: "REJECTED",
                processedBy: userId,
                processedAt
            },{transaction: t});
            return {success: true, message: "Request rejected!"};
        });
        return result;
    }catch(error){
        console.error("Transaction error: ", error.message);
        throw error;
    }
}
exports.detailRequestService = async(requestId) => {
    try{
        const requestItems = await StockRequestItems.findAll({
            where: {requestId: requestId},
            include: [{model: Product, as: "product", attributes: ["id","name"]}]
        });
        return {success: true, requestItems: requestItems}
    }catch(error){
        console.error("Error detail request: ",error);
        throw error;
    }
}