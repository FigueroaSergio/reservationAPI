var express = require("express");
var tokenController = require("../controllers/tokenController");
var router = express.Router();

router.get("/", tokenController.get);
router.post("/:text", tokenController.post);

module.exports = router;
