var express = require("express");
var authController = require("../controllers/authController");
var router = express.Router();
const passport = require("passport");

router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  authController.postSignup
);
router.post("/login", passport.authenticate("login"), authController.postLogin);

module.exports = router;
