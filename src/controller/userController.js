require("dotenv");
const createError = require("../utils/create-error");
const {upload} = require("../utils/cloudinaryService");
const prisma = require("../model/prisma");
const fs = require("fs/promises");
const {checkUserIdSchema} = require("../validator/userValidator");
const { AUTH_USER, UNKNOW, STATUS_ACCEPT, FRIEND, REQUESTER, RECEIVER } = require("../config/constants");

const getTargetUserStatusWithAuthUser = async(targetUserId,authUserId)=>{
    if(targetUserId===authUserId){
        return AUTH_USER;
    }
    const relationship = await prisma.friend.findFirst({
        where:{
            OR:[
            {requesterId:targetUserId,receiverId:authUserId},
            {requesterId:authUserId,receiverId:targetUserId}
        ]
        }
    });
    if(!relationship)return UNKNOW;
    if(relationship.status === STATUS_ACCEPT) return FRIEND;
    if(relationship.requesterId === authUserId) return REQUESTER;

    return RECEIVER;
}

const getTargetUserFriends = async(targetUserId)=>{
    //Status :Accept and (REQUESTER_Id = targetUserId OR RECEVER_ID = targetUserId)

    const relationship = await prisma.friend.findMany({
        where:{
            status:STATUS_ACCEPT,
            OR:[
                {receiverId:targetUserId},
                {requesterId:targetUserId}
            ]},
            select:{
                requester:{select:{
                    id:true,
                    firstName:true,
                    lastName:true,
                    email:true,
                    mobile:true,
                    profileImage:true,
                    coverImage:true
                }},
                receiver:{select:{
                    id:true,
                    firstName:true,
                    lastName:true,
                    email:true,
                    mobile:true,
                    profileImage:true,
                    coverImage:true
                }}
            }
            // include:{
            //     requester:true,
            //     receiver:true
            // }
           
     
    });
    console.log(relationship);
    const friends = relationship.map((e)=>{
        return e.requesterId === targetUserId?e.receiver:e.requester;
    });

    return friends;
}
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

        const userId = +req.params.userId;//string


        const user = await prisma.user.findUnique({
            where:{
                id:userId//datatype ต้องชนิดเดียวกับ Prisma
            }
        });
        
        let status = null;
        let friends = null;

        if(user){
            delete user?.password;//Delete password from Response
            status = await getTargetUserStatusWithAuthUser(userId,req.user.id);
            friends = await getTargetUserFriends(userId);
        }
      
        console.log(status);
        res.status(200).json({user,status,friends});
    }
    catch(err){
        next(err);
    }
}