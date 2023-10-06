const createError = require("../utils/create-error");
const {upload} = require("../utils/cloudinaryService");
const prisma = require("../model/prisma");
const fs = require("fs/promises");

exports.createPost = async(req,res,next)=>{
    try{
        const {message} = req.body;

        if((!message||!message.trim())&&!req.file){
           return next(createError("Message or Image require"),400);
        }
        const data = {userId:req.user.id};
        if(req.file){
            data.image = await upload(req.file.path);
        }
        if(message){
            data.message = message;
        }
        await prisma.post.create({
            data:data
        });
        
        res.status(201).json({message:"Post Created"});
    }
    catch(err){
        next(err)
    }
    finally{
        if(req.file){
            fs.unlink(req.file.path);
        }
    }
}