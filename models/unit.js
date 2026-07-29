const sequelize = require('../config/database');
const {DataTypes} = require('sequelize');

const Unit = sequelize.define("Unit", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    abbreviation: {type: DataTypes.STRING, allowNull: false} 
},{tableName: "units", timestamps: true});

module.exports = Unit;