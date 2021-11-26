var express = require("express");
var authController = require("../controllers/authController");
var router = express.Router();
const passport = require("passport");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  authController.postSignup
);
router.post("/login", passport.authenticate("login"), authController.postLogin);
module.exports = router;
