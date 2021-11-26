var express = require("express");

var product = require("./api/productRouter");
var reservation = require("./api/reservationRouter");
var token = require("./api/tokenRouter");

var router = express.Router();

router.use("/products", product);
router.use("/reservations", reservation);
router.use("/token", token);
module.exports = router;
