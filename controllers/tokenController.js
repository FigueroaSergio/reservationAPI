const resetTime = require("../models/resetTime");
var token = require("../utils/token");

module.exports = {
  get: async function (req, res, next) {
    let reset = await resetTime.create({ reset: new Date() });

    let mytoken = token.getToken({ id: reset._id });
    //console.log(reset);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
      success: true,
      token: mytoken,
      status: "you are authenticate",
    });
  },
  post: async function (req, res, next) {
    let text = req.params.text;
    let mytoken = await token.verifyToken(text);
    if (mytoken.id != null) {
      res.statusCode = 200;
      console.log(mytoken.id);
      let reset = await resetTime.findByIdAndUpdate(
        mytoken.id,
        {
          verificado: true,
        },
        { new: true }
      );

      await reset.save();

      res.setHeader("Content-Type", "application/json");
      res.json({
        success: true,
        token: mytoken,
      });
    } else {
      res.statusCode = 300;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: false,
        token: mytoken,
      });
    }
  },
};
