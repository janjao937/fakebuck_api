require("dotenv");
const prisma = require("../model/prisma");
const {registerSchema, loginSchema} = require("../validator/auth-validator");
const jwt = require("jsonwebtoken");
const bcrypts = require("bcryptjs");
const createError = require("../utils/create-error");

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

        delete user.password;
        res.status(201).json({accessToken,user});

    }catch(err){
        // console.log(err);
        next(err);
    }

}
exports.login = async(req,res,next)=>{
    try{
        const {value,error} = loginSchema.validate(req.body);//validate return {value,error}
        if(error){
            return next(error);
        }
        const user = await prisma.user.findFirst({
            where:{
                OR:[{email:value.emailOrMobile},{mobile:value.emailOrMobile}]//email = emailOrMobile or mobile = emailOrMobile
            }
        });
        if(!user){
            //send status to client
            return next(createError("Invalid credentials",400));
        }

        const isMatch = await bcrypts.compare(value.password,user.password);
        if(!isMatch){
            return next(createError("Invalid credentials",400));
        }

        //create accessToken
        const payload = {userId:user.id};
        const accessToken = jwt.sign(payload,process.env.JWT_SECRET_KEY||"aqqewetlkgl",{expiresIn:process.env.JWT_EXPIRE} );
        delete user.password;
        res.status(200).json({accessToken,user});

    }catch(err){
        next(err);
    }
}

exports.getMe = (req,res,next)=>{
    
    res.status(200).json({user:req.user});
    
}