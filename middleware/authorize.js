module.exports = (...allowRole) => {
    return (req,res,next) => {
        if(!req.user){
            return res.status(401).json({error: `unauthenticated!`})
        }
        if(!req.user.roles.some(role => allowRole.includes(role))){
            return res.status(403).json({error: `Forbidden!`})
        }
        next();
    }
}