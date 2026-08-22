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

// const seedUsers = async() => {
//     try{
//         const count = await User.count();
//         if(count === 0){
//             const bcrypt = require('bcrypt');
//             const hashedPassword = await bcrypt.hash("Business17", 10);
//             await User.bulkCreate([
//                 {
//                     name: "Super Admin",
//                     email: "Superadmin@super.com",
//                     password: hashedPassword
//                 },
//                 {
//                     name: "Admin",
//                     email: "admin1@admin.com",
//                     password: hashedPassword
//                 }
//             ]);
//             console.log("Default users created successfully!");
//         } 
//     }catch(error){
//         console.error("Seeding error: ", error);
//     }
// }
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
sequelize.sync({alter: true})
    .then( () => {
        console.log(`Database Synced`)
        // seedUsers();
        // seedRoles();
        app.listen(port, () => {
            console.log(`App listening on port ${port}`)
        })
    })
    .catch(err => {
        console.error(`DB synced ERROR`, err);
    })