const { response } = require("express");
const reservationProduct = require("../models/reservationProduct");
module.exports = {
  get: function (req, res, next) {
    reservationProduct.find({}, (err, reservationRules) => {
      if (err) res.send(err);
      res.send(reservationRules);
    });
  },
  create: function (req, res, next) {
    reservationProduct
      .create({
        name: req.body.name,
        maxDays: req.body.maxDays,
        start: req.body.startMorning,
        finish: req.body.finishMorning,
        duration: req.body.duration,
        days: req.body.days,
      })
      .then((newRule) => {
        res.send(newRule);
      })

      .catch((err) => next(err));
  },
};
