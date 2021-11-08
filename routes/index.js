var express = require("express");
const reservationRuleController = require("../controllers/reservationProductController");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get("/reservation-products", reservationRuleController.get);

router.post("/reservation-products", reservationRuleController.create);

module.exports = router;
