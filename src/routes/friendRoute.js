const express = require("express");
const authenticateMiddleWare = require("../middleware/authenticate");
const friendController = require("../controller/friendController");

const router = express.Router();

router.post("/:receiverId",authenticateMiddleWare,friendController.requestFriend);
router.patch("/:requesterId",authenticateMiddleWare,friendController.acceptRequest);
router.delete("/:requesterId/reject",authenticateMiddleWare,friendController.rejectRequest);
router.delete("/:receiverId/cancel",authenticateMiddleWare,friendController.cancelRequest);
router.delete("/:friendId/unfriend",authenticateMiddleWare,friendController.unfriend);


module.exports = router;
