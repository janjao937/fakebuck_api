const { valid } = require("joi");
const prisma = require("../model/prisma");
const createError = require("../utils/create-error");
const { checkReceiverIdSchema,checkRequesterIdSchema, checkFriendIdSchema} = require("../validator/userValidator");
const { STATUS_PENDING, STATUS_ACCEPT } = require("../config/constants");

exports.requestFriend = async (req, res, next) => {
  try {
    const { error,value } = checkReceiverIdSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    if (value.receiverId === req.user.id) {
      return next(createError("cannot request urself", 400));
    }
    const targetUser = await prisma.user.findUnique({
      where: {
        id: value.receiverId,
      },
    });

    if (!targetUser) {
      return next(createError("user does not exist"));
    }

    const existRelationship = await prisma.friend.findFirst({
      where: {
        OR: [
          { requesterId: req.user.id, receiverId: value.receiverId },
          { requesterId: value.receiverId, receiverId: req.user.id },
        ],
      },
    });
    if(existRelationship) {
        return next(createError('user already has relationship' , 400))
    }
    await prisma.friend.create({
        data: {
            requesterId: req.user.id,
            receiverId: value.receiverId,
            status : STATUS_PENDING // from config/ constant 
        }
    })

    res.status(201).json("request has been sent");
  } catch (err) {
    next(err);
  }
};

exports.acceptRequest = async (req,res,next)=>{
    try{
        const {value,error} = checkRequesterIdSchema.validate(req.params);
        if(error){
            return next(error);
        }
        const existRelationship = await prisma.friend.findFirst({
            where:{
                requesterId : value.requesterId,
                receiverId : req.user.id,
                status:STATUS_PENDING
            }
        });

        if(!existRelationship){
            return next(createError("relationship does not exits",400));
        }
        await prisma.friend.update({
            data:{
                status:STATUS_ACCEPT
            },
            where:{
                id:existRelationship.id
            }
        });
        res.status(200).json({message:"accepted"})
    }
    catch(err){
        next(err);
    }
}

exports.rejectRequest=async (req,res,next)=>{
    try{
        const exitRelationShip = await prisma.friend.findFirst({
            where:{
                receiverId:req.user.id,
                requesterId: value.requesterId,
                status :STATUS_PENDING
            }
        })
        if(!exitRelationShip){
            return next(createError("Relationship does not exit",400));
        }
        await prisma.friend.delete({
            where:{
                id:exitRelationShip.id
            }
        });
        res.status(200).json({message:"Rejected"});
    }
    catch(err){
        next(err)
    }
}

exports.cancelRequest=async(req,res,next)=>{
    try{
        const {value,error} = checkReceiverIdSchema.validate(req.params);
        if(error){
            return next(error);
        }
        const exitRelationShip = await prisma.friend.findFirst({
            where:{
                requesterId:req.user.id,
                receiverId:value.receiverId,
                status:STATUS_PENDING
            }
        });
        if(!exitRelationShip){
            return next(createError("relationship does not exit",400));
        }
        await prisma.friend.delete({
            where:{
                id:exitRelationShip.id
            }
        });
        res.status(200).json({message:"success cancel"})
    }
    catch(err){
        console.log(err);
    }
}

exports.unfriend =async(req,res,next)=>{
    try{    
        const {value,error} = checkFriendIdSchema.validate(req.params);
        if(error){
            return next(error);
        }
        const exitRelationShip = await prisma.friend.findFirst({
            where:{
                OR:[
                    {requesterId:req.user.id,receiverId:value.friend},
                    {receiverId:req.user.id,requesterId:value.friend}
                ],
                status:STATUS_ACCEPT
            }
        });
        if(!exitRelationShip) return next(createError("Relationship does not exit",400));
        await prisma.friend.delete({
            where:{
                id:exitRelationShip.id
            }
        });
        res.status(200).json({message:"Unfriend success"});
    }
    catch(err){
        console.log(err);
    }
}