const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product',{
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: DataTypes.STRING, allowNull: false},
    stock: {type: DataTypes.INTEGER, defaultValue: 0 ,allowNull: false},
    minimumStock: {type: DataTypes.INTEGER, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: true},
    price: {type: DataTypes.DECIMAL(10,2), allowNull: false},
    productCode : {type: DataTypes.STRING, allowNull: false, unique: true},
    imageURL : {type: DataTypes.STRING, allowNull: false},
    imagePublicId: {type: DataTypes.STRING, allowNull: false},
    unitId: {type: DataTypes.INTEGER, allowNull: false},
    categoryId: {type: DataTypes.INTEGER, allowNull: false}
},{tableName: 'products', timestamps: true});

module.exports = Product;