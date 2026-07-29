const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Supplier = sequelize.define("Supplier", {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: DataTypes.STRING, allowNull: false},
    address: {type: DataTypes.STRING, allowNull: false}
},{tableName: "suppliers", timestamps: true});

module.exports = Supplier;