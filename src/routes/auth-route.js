const express = require("express");
const router = express.Router();
const autController = require("../controller/auth-Controller");
const authenticateMiddleware = require("../middleware/authenticate");

//moddleware

router.post("/register",autController.register);
router.post("/login",autController.login);

// router.use(authenticateMiddleware);//authenticate
// router.get("/me",autController.getMe);//get me

router.get("/me",authenticateMiddleware,autController.getMe);//authenticate and get me


module.exports = router;