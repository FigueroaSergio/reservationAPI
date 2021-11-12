var express = require("express");
const reservationController = require("../controllers/reservationController");

var router = express.Router();

router.get("/", reservationController.get);
router.post("/", reservationController.post);
router.put("/:id", reservationController.update);
router.delete("/:id", reservationController.delete);
module.exports = router;
