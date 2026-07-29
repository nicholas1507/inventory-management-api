require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const {v4: uuidv4} = require('uuid');

//Konfigurasi cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: `inventory_images/products`,
//         allowed_formats: ['jpg','png','jpeg','gif'],
//         public_id: (req,file) => Date.now() + '-' + file.originalname
//     }
// });
// const productImage = multer({
//     storage: storage,
//     limits: {fileSize: 5 * 1024 * 1024}
// });

const createUploadMiddleware = ((folderGenerator) => {
    return multer({
        storage: new CloudinaryStorage({
            cloudinary: cloudinary,
            params: async(req,file) => ({
                folder: folderGenerator(req,file),
                allowed_formats : ['jpg','png','jpeg','gif'],
                public_id: uuidv4()
            }
            )
        }),
        limits: {fileSize: 5 * 1024 * 1024}
    })
});
const uploadProfile = createUploadMiddleware((req) => {
    const userId = req.user?.id || "default";
    return `inventory_web/profile/${userId}`
});
const productImage = createUploadMiddleware(() => `inventory_web/products`)

module.exports = {cloudinary, uploadProfile,productImage};