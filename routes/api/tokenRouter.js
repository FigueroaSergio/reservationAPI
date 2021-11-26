var express = require("express");
var tokenController = require("../../controllers/tokenController");
const verifyUser = require("../../utils/auth").verifyUser;

var router = express.Router();

router.get("/", tokenController.get);
router.post("/:text", tokenController.post);
router.use(verifyUser);

module.exports = router;
