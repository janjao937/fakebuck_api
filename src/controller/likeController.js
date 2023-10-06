const prisma = require("../model/prisma");
const createError = require("../utils/create-error");
const {checkPostIdSchema} = require("../validator/postValidator");

exports.toggleLike = async(req,res,next)=>{
    try{
        const {value,error} = checkPostIdSchema.validate(req.params);
        if(error){
            return next(error);
        }
        const exitPost = await prisma.post.findUnique({
            where:{
                id:value.postId
            }
        });

        if(!exitPost){
            return next(createError("post does not exit",400));
        }

        const exitLike = await prisma.like.findFirst({
            where:{
                userId:req.user.id,
                postId:value.postId
            }
        });

        if(exitLike)
        {
            await prisma.like.delete({
                where:{
                    id:exitLike.id
                }
            });
            await prisma.post.update({
                data:{
                    totalLike:{
                        decrement:1
                    }
                },
                where:{
                    id:value.postId
                }

            });
            return res.status(200).json({message:"unliked"});
        }
        await prisma.like.create({
            data: {
              userId: req.user.id,
              postId: value.postId
            }
          });
      
        await prisma.post.update({
            data:{
                totalLike:{
                    increment:1
                }
            },
            where:{
                id:value.postId
            }
        });

        res.status(200).json({message:"liked"});
    }
    catch(err){
        next(err);
    }
}