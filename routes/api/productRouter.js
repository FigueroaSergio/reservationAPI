var express = require("express");
const productController = require("../../controllers/ProductController");
const verifyUser = require("../../utils/auth").verifyUser;
var router = express.Router();

router.get("/", productController.get);
router.use(verifyUser);
router.post("/", productController.post);
router.put("/:id", productController.update);
router.delete("/:id", productController.delete);
module.exports = router;
