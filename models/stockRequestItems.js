const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const StockRequestItems = sequelize.define("StockRequestItems", {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    productId: {type: DataTypes.INTEGER, allowNull: false},
    requestId: {type: DataTypes.INTEGER, allowNull: false},
    quantity: {type: DataTypes.INTEGER, allowNull: false}
},{
    tableName: "stock_request_items",
    timestamps: true,
    indexes : [
        {
            unique: true,
            fields: ["productId", "requestId"]
        }
    ]
});

module.exports = StockRequestItems;