require("dotenv");
const prisma = require("../model/prisma");
const {registerSchema} = require("../validator/auth-validator");
const jwt = require("jsonwebtoken");
const bcrypts = require("bcryptjs");
// const prisma = require("prisma");
exports.register =async(req,res,next)=>{
    try{
        const {value,error} = registerSchema.validate(req.body);
        if(error){
            return next(error);
        }
        value.password = await bcrypts.hash(value.password,12); 
        const user = await prisma.user.create({
            data:value
        });
        const payload = {userId:user.id};
        const accessToken = jwt.sign(payload,process.env.JWT_SECRET_KEY||"aqqewetlkgl",{
            expiresIn:process.env.JWT_EXPIRE
        });
        res.status(200).json({accessToken});
    }catch(err){
        console.log(err);
        next(err);
    }

}
exports.login = async(req,res,next)=>{
    try{

    }catch(err){
        next(err);
    }
}