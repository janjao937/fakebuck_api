const {rateLimit} =require("express-rate-limit");

//เอาไว้ limit จำนวนการ send request ของแต่ละ ip
module.exports = rateLimit({
    windowMs:15*60*1000,//15 min
    limit:100,//limit request ip,
    message:{message:"too many request from this ip"}
});

