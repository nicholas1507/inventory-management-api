const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const StockRequest = sequelize.define("StockRequest", {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    userId: {type: DataTypes.INTEGER, allowNull: false},
    status: {type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED","CANCELLED"), allowNull: false, defaultValue: 'PENDING'},
    processedBy : {type: DataTypes.INTEGER, allowNull: true},
    processedAt : {type: DataTypes.DATE, allowNull: true},
    customerId: {type: DataTypes.INTEGER, allowNull: false}
},{tableName: "stock_request", timestamps: true});

module.exports = StockRequest;