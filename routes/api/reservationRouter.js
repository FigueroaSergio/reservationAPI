var express = require("express");
const reservationController = require("../../controllers/reservationController");
const verifyUser = require("../../utils/auth").verifyUser;

var router = express.Router();

router.get("/", reservationController.get);
router.post("/reservar", reservationController.postReservar);
router.get("/confirmar/:token", reservationController.getConfirm);

router.use(verifyUser);

router.get("/all", reservationController.getAll);
router.post("/", reservationController.post);
router.put("/:id", reservationController.update);
router.delete("/:id", reservationController.delete);
module.exports = router;
