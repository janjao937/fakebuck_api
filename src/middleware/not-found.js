module.exports = (req,res,next)=>{
    // throw new Error("test Error middle ware");
    res.status(404).json({message:"resource not found this server"});
}