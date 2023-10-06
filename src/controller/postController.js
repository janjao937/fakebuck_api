const createError = require("../utils/create-error");
const {upload} = require("../utils/cloudinaryService");
const prisma = require("../model/prisma");
const fs = require("fs/promises");
const {STATUS_ACCEPT} = require("../config/constants");

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

const getFriendId = async(targetUserId)=>{
    const relationship = await prisma.friend.findMany({
        where:{
            OR:[
                {receiverId:targetUserId},
                {requesterId:targetUserId},
            ],
            status:STATUS_ACCEPT
        }
    });
    const friend = relationship.map((e)=>e.receiverId===targetUserId?e.requesterId:e.receiverId);
    return friend;
}

exports.getAllPostInCludeFriend = async(req,res,next)=>{
    try{
        const friendIds = await getFriendId(req.user.id);
        const posts = await prisma.post.findMany({
            where: {
              userId: {
                in: [...friendIds, req.user.id]
              }
            },
            orderBy: {
              createdAt: 'desc'
            },
            include: 
            {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  profileImage: true
                }
              },
              likes:{
                select: {
                  userId: true
                }
              }
            }

          });
        res.status(200).json({posts});
    }
    catch(err){
        next(err);
    }
}