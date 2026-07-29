const sequelize = require('../config/database');
const {DataTypes} = require('sequelize');

const Profil = sequelize.define("Profil", {
    id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
    userId: {type: DataTypes.INTEGER, allowNull: false, unique: true},
    address: {type: DataTypes.STRING, allowNull: true},
    bio: {type: DataTypes.STRING, allowNull: true},
    imagePublicId: {type: DataTypes.STRING, allowNull: true},
    imageURL: {type: DataTypes.STRING, allowNull: true}
},{tableName: "profiles", timestamps: true});

module.exports = Profil;