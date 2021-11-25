require("dotenv").config();
const passport = require("passport");
const verifyUser = require("./utils/auth").verifyUser;

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var additions = require("./controllers/ProductController");

var indexRouter = require("./routes/index");
var product = require("./routes/productRouter");
var reservation = require("./routes/reservationRouter");
var token = require("./routes/tokenRouter");
var auth = require("./routes/authRouter");

additions.additions.resetAtMidnight();
mongoose.connect(process.env.MONGO_URI);
var app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(passport.initialize());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/entry", auth);
app.use("/products", verifyUser, product);
app.use("/reservations", verifyUser, reservation);
app.use("/token", verifyUser, token);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
