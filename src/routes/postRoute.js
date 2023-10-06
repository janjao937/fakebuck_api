const express  = require("express");
const authenticateMiddleWare = require("../middleware/authenticate");
const uploadMiddleware = require("../middleware/upload");
const postController = require("../controller/postController");

const router = express.Router();

router.post("/",authenticateMiddleWare,uploadMiddleware.single("image"),postController.createPost);

module.exports = router;