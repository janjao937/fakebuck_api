const express = require("express");
const userController = require("../controller/userController");
const authenticate = require("../middleware/authenticate");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(authenticate);
router.use(upload.single("qwerty"));

//middleware
router.patch("/",userController.updateProfile);

module.exports= router;