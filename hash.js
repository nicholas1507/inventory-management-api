// const data = [
//     {id: 1, name: "Laptop"},
//     {id: 2, name: "Mouse"},
//     {id: 3, name: "Remote"},
//     {id: 4, name: "USB"},
//     {id: 5, name: "Charger"},
//     {id: 6, name: "Shoes"},
//     {id: 7, name: "Chair"},
//     {id: 8, name: "Desk"},
//     {id: 9, name: "PC"},
//     {id: 10, name: "T-shirt"},
//     {id: 11, name: "Pants"},
//     {id: 12, name: "Bag"},
//     {id: 13, name: "Keyboard"},
//     {id: 14, name: "Tissue"},
//     {id: 15, name: "Shampoo"},
// ]

// let page = 1;
// const limit = 5;
// let start = (page - 1) * limit;
// let end = start + limit;

// const search = "B";
// const searching = data.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
// console.log(searching);

// let paginatedData = searching.slice(start, end);
// console.log(paginatedData);

// const array = [1,4,6,7,3,9,10];

// function pisahGenapGanjil(array){
//     let genap = [];
//     let ganjil = [];
//     array.forEach(n => {
//         if(n % 2 === 0){
//             genap.push(n)
//         }else{
//             ganjil.push(n)
//         }
//     });
//     return {genap,ganjil};
// }
// console.log(pisahGenapGanjil(array));

// const express = require('express')
// const app = express();
// app.post('/order', async(req,res) => {
//     try{
//         const result = await sequelize.transaction(async(t) => {
//             const {productId,quantity} = req.body;
//             const product = await Product.findByPk(productId,{transaction: t, lock:t.LOCK.UPDATE});
//             if(!product){
//                 throw new Error("Product tidak ditemukan!");
//             }
//             const stockBefore = Number(product.stock);
//             const qty = Number(quantity)
//             if(stockBefore < qty){
//                 throw new Error("Stock tidak mencukupi!");
//             }
//             const stockAfter = stockBefore - qty;
//             const order = await Order.create({productId,quantity},{transaction: t});
//             product.stock = stockAfter;
//             await product.save({transaction: t});
//             return {order,product}
//         });
//         res.status(201).json({success: true,data: result})
//     }catch(error){
//         console.error(error);
//         res.status(500).json(error);
//     }
// })
// app.post('/register',async(req,res) => {
//     try{
//         const {username,email,password} = req.body;
//         if(!username || !email || !password){
//             return res.status(404).json({error: "Wajib isi semua form!"});
//         }
//         const existing = await User.findOne({where: {email}});
//         if(existing){
//             return res.status(400).json({error: "Email ini telah digunakan,coba lagi!"});
//         }
//         const hashPw = await bcrypt.hash(password,10);
//         const user = await User.create({username,email,password});
//         return res.status(201).json({message: "User berhasil dibuat",id: user.id});
//     }catch(error){
//         console.error(error);
//         res.status(500).json({
//             error: error.message
//         })
//     }
// })