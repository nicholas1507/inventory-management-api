const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const StockMovement = sequelize.define("StockMovement",{
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    productId: {type: DataTypes.INTEGER, allowNull: false},
    userId: {type: DataTypes.INTEGER, allowNull: false},
    type: {type: DataTypes.ENUM("IN","OUT","ADJUSTMENT","TRANSFER"), allowNull: false},
    quantity: {type: DataTypes.INTEGER, allowNull: false},
    supplierId: {type: DataTypes.INTEGER, allowNull: true},
    customerId: {type: DataTypes.INTEGER, allowNull: true},
    requestId: {type: DataTypes.INTEGER, allowNull: true},
    stockBefore: {type: DataTypes.INTEGER, allowNull: false},
    stockAfter: {type: DataTypes.INTEGER, allowNull: false},
    referenceType: {type: DataTypes.ENUM("PURCHASE","SALE","REQUEST","TRANSFER","ADJUSTMENT"), allowNull: false},
    referenceCode: {type: DataTypes.STRING, allowNull: false},
    notes: {type: DataTypes.STRING, allowNull: true}
},{
    tableName: 'stock_movement',
    timestamps: true,
    indexes: [
        {
            name: 'index_product_date',
            fields: ['productId','createdAt']
        },
        {
            name: 'index_user',
            fields: ['userId']
        },
        {
            name: 'index_reference',
            fields: ['referenceType','referenceCode']
        },
        {
            name: 'index_created',
            fields: ['createdAt']
        }
    ]
});

module.exports = StockMovement;