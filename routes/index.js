const routes = require('express').Router();
const authRoute = require('../routes/authRoutes');
const categoryRoutes = require('../routes/categoryRoutes');
const productRoutes = require('../routes/productRoutes');
const roleRoutes = require('../routes/roleRoutes');
const userRoutes = require('../routes/userRoutes');
const customerRoutes = require('./customer');
const supplierRoutes = require('./supplier');
const movementRoutes = require('./movementRoutes');
const requestRoutes = require('./requestRoutes');
const unitRoutes = require('./unit');
const dashboardRoutes = require('./dashboardRoutes');

routes.get('/', (req,res) => {
    res.json({message: `Hello web_Inventory`})
})

routes.use('/', authRoute);
routes.use('/categories', categoryRoutes);
routes.use('/products', productRoutes);
routes.use('/roles', roleRoutes);
routes.use('/users', userRoutes);
routes.use('/customers', customerRoutes);
routes.use('/suppliers', supplierRoutes);
routes.use('/movements', movementRoutes);
routes.use('/requests', requestRoutes);
routes.use('/units', unitRoutes);
routes.use('/dashboards', dashboardRoutes);

module.exports = routes;
