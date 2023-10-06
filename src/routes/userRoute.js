const express = require("express");
const userController = require("../controller/userController");
const authenticate = require("../middleware/authenticate");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(authenticate);

// router.use(upload.array("qwerty"));
// router.use(upload.single("qwerty"));
router.use(upload.fields(
    [{name:"profileImage",maxCount:1},{name:"coverImage",maxCount:1}]
));


router.get("/:userId",authenticate,userController.getUserById);

//middleware
router.patch("/",userController.updateProfile);

module.exports= router;