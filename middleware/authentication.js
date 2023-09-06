const jsonwebtoken= require("jsonwebtoken");
const User = require("../models/User");
const { UnauthenticatedError } = require("../errors");


const auth=(req,res,next)=>{
    //check header
    const authHeader=req.headers.authorization
    if(!authHeader||!authHeader.startsWith('Bearer '))
    {
        throw new UnauthenticatedError('Authentication failed')
    }
    const token=authHeader.split(' ')[1]
    try {
        const payload=jsonwebtoken.verify(token,process.env.JWT_SECRET)
        req.user={userId:payload.userId,name:payload.name}
        next()
    } catch (error) {
        throw new UnauthenticatedError('Authentication failed')
    }
}

module.exports=auth