const jwt = require("jsonwebtoken");

module.exports = {
  postSignup: function (req, res, next) {
    res.json({
      message: "Signup successful",
      user: req.user,
    });
  },
  postLogin: function (req, res, next) {
    try {
      if (!req.user) {
        const error = new Error(req.message);

        return next(error);
      }
      const body = { _id: req.user._id, email: req.user.email };
      const token = jwt.sign(body, process.env.SECRET_JWT, { expiresIn: 100 });
      //console.log(token);
      res.send({ token: token });
    } catch (error) {
      return next(error);
    }
  },
};
