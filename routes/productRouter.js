var express = require("express");
const productController = require("../controllers/ProductController");

var router = express.Router();

router.get("/", productController.api.get);
router.post("/", productController.api.post);
router.put("/:id", productController.api.update);
router.delete("/:id", productController.api.delete);
module.exports = router;
