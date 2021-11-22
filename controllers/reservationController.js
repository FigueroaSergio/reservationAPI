const Reservation = require("../models/reservation");
module.exports = {
  get: function (req, res, next) {
    Reservation.find({ status: "created" }).then((reservations) => {
      res.send(reservations);
    });
  },
  post: function (req, res, next) {
    Reservation.create({ date: req.body.date })
      .then((reservation) => {
        res.send(reservation);
      })
      .catch((err) => {
        res.send(err);
      });
  },
  update: function (req, res, next) {
    Reservation.findByIdAndUpdate(req.params.id, {
      client: req.body.client,
      status: req.body.status,
    })
      .then((reservation) => {
        console.log.apply(reservation);
        reservation.save();
      })
      .then((reservation) => {
        res.send(reservation);
      });
  },
  delete: function (req, res, next) {
    Reservation.findByIdAndDelete(req.params.id).then((reservation) => {
      res.status = 200;
      res.send({ status: "success" });
    });
  },
};
