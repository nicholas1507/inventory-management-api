const {approvedRequestService, cancelRequestService,rejectRequestService, createRequestService,detailRequestService, getStockRequestsService, getRequestById} = require('../services/StockRequestService');

exports.getStockRequests = async(req,res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = (req.query.search || "").trim();
        const status = req.query.status;
        const offset = (page - 1) * limit;
        const result = await getStockRequestsService(page,limit,search,offset,status);
        res.status(200).json({
            data: result.data,
            pagination: result.pagination
        });
    }catch(error){
        console.error("Error: ", error);
        res.status(500).json({
            error: error.message
        })
    }
}
exports.getRequestById = async(req,res) => {
    try{
        const id = req.params.id;
        const result = await getRequestById(id);
        res.status(200).json({
            success: result.success,
            data: result.data,
            message: result.message
        });
    }catch(error){
        res.status(500).json({
            error: error.message
        });
    }
}
exports.createRequest = async(req,res) => {
    try{
        const userId = req.user.id;
        const {items,customerId} = req.body;
        const result = await createRequestService(userId,items,customerId);
        res.status(201).json({
            succes: true,
            data: result,
            message: "Create request successfully!"
        });
    }catch(error){
        res.status(500).json({
            error: error.message
        })
    }
}
exports.approvedRequest = async(req,res) => {
    try{
        const id = req.params.id;
        const userId = req.user.id;
        const result = await approvedRequestService(id,userId);
        res.status(200).json({
            success: true,
            data: result,
            message: "Request approved!"
        });
    }catch(error){
        console.error("ERROR", error);
        console.error("--- ERROR DETECTED ---");
        console.error("Name:", error.name);
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
        console.error("-----------------------");
        res.status(400).json({
            error: error.message
        })
    }
}
exports.cancelRequest = async(req,res) => {
    try{
        const id = req.params.id;
        const requestService = await cancelRequestService(id);
        res.status(200).json({message: requestService.message});
    }catch(error){
        res.status(400).json({
            error: error.message
        })
    }
}
exports.rejectRequest = async(req,res) => {
    try{
        const {id} = req.params;
        const processedBy = req.user.id;
        const rejectService = await rejectRequestService(id,processedBy);
        res.status(200).json({message: rejectService.message});
    }catch(error){
        res.status(400).json({
            error: error.message
        })
    }
}
exports.detailRequestItems = async(req,res) => {
    try{
        const requestId = req.params.id;
        const result = await detailRequestService(requestId);
        res.status(200).json({
            succes: true,
            data: result.requestItems,
            message: "Successfully received the requestIems!"
        });
    }catch(error){
        console.error("error: ", error);
        res.status(500).json({
            error: error.message
        })
    }
}