const {createMovementService, getMovementsService, userActivityService} = require('../services/StockMovementService');

exports.getMovements = async(req,res) => {
    try{
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 10;
        const search = (req.body.search || "").trim();
        const type = req.body.type;
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);
        const maker = req.body.maker;
        const offset = (page - 1) * limit;
        const isUser = (req.user.roles).includes("User");
        const result = await getMovementsService(page,limit,search,type,startDate,endDate,maker,offset,isUser);
        res.status(200).json({
            data: result.data,
            pagination: result.pagination
        });
    }catch(error){
        console.error("Error", error);
        res.status(500).json({
            error: error.message
        })
    }
}
exports.createMovement = async(req,res) => {
    try{
        const userId = req.user.id;
        const {items, supplierId, customerId, notes, type} = req.body;
        const movement = await createMovementService(userId,items,supplierId,notes,customerId,type);
        res.status(201).json({
            success: true,
            data: movement,
            message: "Create movement successfully!"
        })
    }catch(error){
        res.status(500).json({
            error:error.message
        })
    }
}
exports.userActivity = async(req,res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = (req.query.search || "").trim();
        const offset = (page-1) * limit;
        const result = await userActivityService(page,limit,search,offset);
        res.status(200).json({
            data: result.data,
            pagination: result.pagination
        });
    }catch(error){
        res.status(500).json({
            error: error.message
        })
    }
}