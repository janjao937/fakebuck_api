require("dotenv");
const createError = require("../utils/create-error");
const jwt = require("jsonwebtoken");
const prisma = require("../model/prisma");

module.exports = async(req,res,next)=>{
    try{
        const authorization = req.headers.authorization;
        if(!authorization||!authorization.startsWith("Bearer ")){
            return next(createError("Unauthenticated",401));//send ro error middleware
        }
        const token = authorization.split("Bearer ")[1];//split("Bearer ")return ["",token] or split(" ") return ["Bearer",token]
        
        //jwt verify token
        const payload = jwt.verify(token,process.env.JWT_SECRET_KEY||"asdadfv");
        const user = await prisma.user.findUnique({
            where:{
                id:payload.userId
            }
        });
        if(!user){
            return next(createError("unauthenticated",401));
        }
        delete user.password;
        req.user = user;
        
        next();
    }
    catch(err){ 
        if(err.name ==="TokenExpiredError"||err.name ==="JsonWebTokenError")//check error 401 jwt:TokenExpiredError,JsonWebTokenError
        {
            err.statusCode=401;
        }
    }
}