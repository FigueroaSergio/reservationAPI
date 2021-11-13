var express = require("express");
const productController = require("../controllers/ProductController");

var router = express.Router();

router.get("/", productController.get);
router.post("/", productController.post);
router.put("/:id", productController.update);
router.delete("/:id", productController.delete);
module.exports = router;
