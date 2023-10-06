const express  = require("express");
const authenticateMiddleWare = require("../middleware/authenticate");
const uploadMiddleware = require("../middleware/upload");
const postController = require("../controller/postController");
const likeController = require("../controller/likeController");
const router = express.Router();

router.post("/",authenticateMiddleWare,uploadMiddleware.single("image"),postController.createPost);

router.get("/friend",authenticateMiddleWare,postController.getAllPostInCludeFriend);
router.post("/:postId/like",authenticateMiddleWare,likeController.toggleLike);





module.exports = router;