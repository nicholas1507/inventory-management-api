const { Op, Sequelize } = require("sequelize");
const { User, Role, Product, StockMovement, StockRequest, Supplier, Category, Unit, Customer } = require("../models")

exports.dashboardSummary = async(req,res) => {
    try{
        const role = req.user?.roles[0];
        const [
            totalProducts,
            totalRequests,
            totalSuppliers,
            totalCategories,
            totalUnits,
            totalCustomers,
            pendingRequests,
            lowStockProducts,
            movementsIn,
            movementsOut
        ] = await Promise.all([
            Product.count(),
            StockRequest.count(),
            Supplier.count(),
            Category.count(),
            Unit.count(),
            Customer.count(),
            StockRequest.count({where: {status: "PENDING"}}),
            Product.count({where: {stock : {[Op.lte]: Sequelize.col('minimumStock')}}}),
            StockMovement.count({where: {type: "IN"}}),
            StockMovement.count({where: {type: "OUT"}})
        ]);
        let summary = {
            totalProducts,
            totalMovements: movementsIn + movementsOut,
            movementsIn,
            movementsOut,
            totalRequests,
            totalSuppliers,
            totalCategories,
            totalUnits,
            totalCustomers
        }
        if(role === "Super Admin"){
            summary.totalUsers = await User.count();
            summary.totalRoles = await Role.count();
        }
        return res.status(200).json({
            status: "success",
            data: {
                summary,
                alerts:{
                    pendingRequests,
                    lowStockProducts
                }
            }
        });
    }catch(error){
        res.status(500).json({
            error: error.message
        })
    }
}
exports.userDashboard = async(req,res) => {
    try{
        const userId = req.user.id;
        const [totalProducts,totalRequests,lowStockProducts,myPendingRequests] = await Promise.all([
            Product.count(),
            StockRequest.count(),
            Product.count({where: {stock: {[Op.lte]: Sequelize.col('minimumStock')}}}),
            StockRequest.count({where: {status: "PENDING",userId}})
        ])
        res.status(200).json({
            status: "success",
            data: {
                summary: {
                    totalProducts,
                    totalRequests
                },
                alert: {
                    lowStockProducts,
                    myPendingRequests
                }
            }
        })
    }catch(error){
        console.error(error);
        res.status(500).json({
            error: error.message
        })
    }
}