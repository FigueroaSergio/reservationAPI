var express = require("express");
const reservationRuleController = require("../controllers/reservationProductController");

var router = express.Router();

router.get("/", reservationRuleController.get);
router.post("/", reservationRuleController.post);
router.put("/:id", reservationRuleController.update);
router.delete("/:id", reservationRuleController.delete);
module.exports = router;
