const express = require("express");
const router = express.Router();
const autController = require("../controller/auth-Controller");
router.post("/register",autController.register);

module.exports = router;