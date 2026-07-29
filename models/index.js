const sequelize =  require('../config/database');
const Category = require('./category');
const Product = require('./product');
const Role = require('./role');
const User = require('./user');
const Profile = require('./profil');
const Unit = require('./unit');
const Supplier = require('./supplier');
const Customer = require('./customer');
const StockMovement = require('./stockMovement');
const StockRequest = require('./stockRequest');
const StockRequestItems = require('./stockRequestItems');

// One to One
User.hasOne(Profile, {foreignKey: "userId", as: 'profile', onDelete: 'CASCADE'});
Profile.belongsTo(User, {foreignKey: "userId", as: 'user'});


// One to many
Category.hasMany(Product, {foreignKey: 'categoryId', as: 'products', onDelete: 'RESTRICT'});
Product.belongsTo(Category, {foreignKey: 'categoryId', as: 'category'});

Unit.hasMany(Product, {foreignKey: "unitId", as: 'products'});
Product.belongsTo(Unit, {foreignKey: "unitId", as: "unit"});

Supplier.hasMany(StockMovement, {foreignKey: 'supplierId', as: 'stockMovements'});
StockMovement.belongsTo(Supplier, {foreignKey: 'supplierId', as: 'supplier'});

Customer.hasMany(StockMovement, {foreignKey: 'customerId', as: 'stockMovements'});
StockMovement.belongsTo(Customer, {foreignKey: 'customerId', as: 'customer'});

Customer.hasMany(StockRequest, {foreignKey: "customerId", as: "stockRequests"});
StockRequest.belongsTo(Customer, {foreignKey: "customerId", as: "customers"});

StockRequest.hasMany(StockMovement, {foreignKey: 'requestId', as: 'stockMovements'});
StockMovement.belongsTo(StockRequest, {foreignKey: 'requestId', as: 'stockRequest'});

StockRequest.hasMany(StockRequestItems, {foreignKey: 'requestId', as: 'requestItems', onDelete: 'RESTRICT'});
StockRequestItems.belongsTo(StockRequest, {foreignKey: 'requestId', as: 'stockRequest'});

Product.hasMany(StockRequestItems, {foreignKey: 'productId', as: 'requestItems', onDelete: 'RESTRICT'});
StockRequestItems.belongsTo(Product, {foreignKey: 'productId', as: 'product'});

Product.hasMany(StockMovement, {foreignKey: 'productId', as: 'stockMovements'});
StockMovement.belongsTo(Product, {foreignKey: 'productId', as: 'product'});

User.hasMany(StockMovement, {foreignKey: 'userId', as: 'stockMovements'});
StockMovement.belongsTo(User, {foreignKey: 'userId', as: 'user'});

User.hasMany(StockRequest, {foreignKey: 'userId', as: 'createdRequests'});
StockRequest.belongsTo(User, {foreignKey: 'userId', as: 'creator'});

User.hasMany(StockRequest, {foreignKey: 'processedBy', as: 'processedRequests'});
StockRequest.belongsTo(User, {foreignKey: 'processedBy', as: 'processor'});


// Many to many
Role.belongsToMany(User, {through: 'userRoles' ,foreignKey: 'roleId', as: 'users'});
User.belongsToMany(Role, {through: 'userRoles', foreignKey: 'userId', as: 'roles'})

StockRequest.belongsToMany(Product, {through: StockRequestItems, foreignKey: 'requestId', as: 'products'});
Product.belongsToMany(StockRequest, {through: StockRequestItems, foreignKey: 'productId', as: 'stockRequests'});

module.exports = { 
    sequelize, 
    Category, 
    Product, 
    Role, 
    User, 
    Profile, 
    Unit, 
    Supplier, 
    Customer, 
    StockMovement, 
    StockRequest, 
    StockRequestItems 
}