require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports =  (req,res,next) => {
    const headers = req.headers.authorization;
    if(!headers) return res.status(401).json({message: `Headers missing!!`});
    
    const [scheme, token] = headers.split(' ');
    if(scheme !== "Bearer" || !token) return res.status(401).json({message: `Invalid authorization format!!`});
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next(); 
    }catch(err){
        res.status(500).json(err);
    }
}