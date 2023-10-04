require("dotenv");
const createError = require("../utils/create-error");
const {upload} = require("../utils/cloudinaryService");
const prisma = require("../model/prisma");
const fs = require("fs/promises");
const {checkUserIdSchema} = require("../validator/userValidator");

exports.updateProfile=async(req,res,next)=>{
    try{
        // console.log(req.files);//array||fields  //at useRoute
        // console.log(req.file);//single   //at useRoute
        if(!req.files){
            return next(createError("profile image or cover image is required"));
        }
        const response = {};

        if(req.files.profileImage){
            const url = await upload(req.files.profileImage[0].path);
            response.profileImage = url;
            // console.log(url);
            await prisma.user.update({
                data:{
                    profileImage:url
                },
                where:{
                    id:req.user.id
                }
            });
        }

        if(req.files.coverImage){
            const url = await upload(req.files.coverImage[0].path);
            response.coverImage = url;
            // console.log(url);
            await prisma.user.update({
                data:{
                    coverImage:url
                },
                where:{
                    id:req.user.id
                }
            });
        }
        res.status(200).json(response);

    }catch(err){
        next(err);
    }
    finally{
        if(req.files.profileImage){
            fs.unlink(req.files.profileImage[0].path);
        }
        if(req.files.coverImage){
            fs.unlink(req.files.coverImage[0].path);
        }

    }
}

exports.getUserById =async(req,res,next)=>{
    try{
        const {error} = checkUserIdSchema.validate(req.params);
        
        if(error){
            return next(error);
        }

        const userId = req.params.userId;//string

        const user = await prisma.user.findUnique({
            where:{
                id:+userId//datatype ต้องชนิดเดียวกับ Prisma
            }
        });

        delete user?.password;//Delete password from Response

        res.status(200).json({user});
    }
    catch(err){
        next(err);
    }
}