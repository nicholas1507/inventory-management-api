require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { sequelize, User, Role } = require('./models');
const cors = require('cors');

app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const routes = require('./routes');
app.use(routes);

// const seedRoles = async() => {
//     try{
//         const count = await Role.count();
//         if(count === 0){
//             const roles = await Role.bulkCreate([
//                 {
//                     name: "Super Admin"
//                 },
//                 {
//                     name: "Admin"
//                 },
//                 {
//                     name: "User"
//                 },
//             ])
//         }
//         console.log("Default Role successfully created!");
//     }catch(error){
//         console.error("Errorrr");
//     }
// }


// const seedUsersAndRoles = async () => {
//     try {
//         const userCount = await User.count();
//         if (userCount === 0) {
//             const superAdminUser = await User.create({
//                 name: "Super Admin",
//                 email: "superadmin@gmail.com",
//                 password: await require('bcrypt').hash("business17", 10)
//             });

//             const adminUser = await User.create({
//                 name: "Admin",
//                 email: "admin@gmail.com",
//                 password: await require('bcrypt').hash("business17", 10)
//             });

//             const superAdminRole = await Role.findOne({ where: { name: "Super Admin" } });
//             const adminRole = await Role.findOne({ where: { name: "Admin" } });

//             if (superAdminRole) await superAdminUser.addRole(superAdminRole);
//             if (adminRole) await adminUser.addRole(adminRole);

//             console.log("Default users and their roles created successfully!");
//         }
//     } catch (error) {
//         console.error("Seeding error: ", error);
//     }
// };

sequelize.sync({alter: true})
    .then( () => {
        console.log(`Database Synced`)
        // seedRoles();
        // seedUsersAndRoles();
        app.listen(port, () => {
            console.log(`App listening on port ${port}`)
        })
    })
    .catch(err => {
        console.error(`DB synced ERROR`, err);
    })