require('dotenv').config();
const {User, Role} = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async(req,res) => {
    try{
        const {name, email, password} = req.body;
        const existing = await User.findOne({where: {email}});
        if(existing) return res.status(400).json({error: `Email already used,try another!`});
        const hashPw = await bcrypt.hash(password, 10);
        const acc = await User.create({name, email, password: hashPw});
        const userRole = await Role.findOne({where: {name: 'User'}});
        if(!userRole) return res.status(403).json({error: `Default Role Not Found!`})
        await acc.setRoles([userRole.id]);
        res.status(201).json({id: acc.id, name: acc.name, email: acc.email});
    }catch(err){
        res.status(500).json(err);
    }
}
exports.login = async(req,res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({
            where: {email},
            include: [{model: Role, as: 'roles', attributes: ['name']}]
        });
        if(!user) return res.status(404).json({message: `Incorrect email or password!`});
        const validation = await bcrypt.compare(password, user.password);
        if(!validation) return res.status(403).json({error: `Incorrect email or password!`});

        const roles = user.roles.map(role => role.name);
        const token = jwt.sign({id: user.id, roles}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
        const userData = {id: user.id, roles: roles}
        res.status(200).json({token, userData});
    }catch(err){
        res.status(500).json(err);
    }
}