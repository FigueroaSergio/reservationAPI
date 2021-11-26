const Reservation = require("../models/reservation");
const token = require("../utils/token");
const Client = require("../models/client");
const sengrid = require("../utils/sengrid");

module.exports = {
  get: function (req, res, next) {
    Reservation.find({ status: "created" }).then((reservations) => {
      res.send(reservations);
    });
  },
  getAll: function (req, res, next) {
    Reservation.find({}).then((reservations) => {
      res.send(reservations);
    });
  },
  getConfirm: function (req, res, next) {
    let verify = token.verifyToken(req.params.token);
    if (verify.error || verify.reservations.length == 0) {
      res.send(verify);
    } else {
      let { name, email, reservations } = verify;
      //console.log(reservations);
      Reservation.updateMany(
        { _id: { $in: reservations } },
        { status: "reserved" }
      ).then((reser) => {
        // console.log(reser);
        Client.findOne({ email: email }).then((client) => {
          if (client == null) {
            Client.create({
              name: name,
              email: email,
              reservations: reservations,
            });
          } else {
            for (let i = 0; i < reservations.length; i++) {
              if (client.reservations.indexOf(reservations[i]) == -1)
                client.reservations.push(reservations[i]);
            }

            client.save().then((client) => {
              res.send(client);
            });
          }
        });
      });
    }
  },
  postReservar: function (req, res, next) {
    let { name, email, reservations } = req.body;
    if (!name || !email) res.send({ error: "name and email are requiered" });
    else if (reservations.length == 0) {
      res.send({ error: "Select one or more reservations" });
    } else {
      //console.log(reservations);
      Reservation.find({ _id: { $in: reservations }, status: "created" })
        .then((resers) => {
          // console.log(resers);
          reservations = [];
          resers.forEach((element) => {
            reservations.push(element._id);
            console.log(element);
          });
          if (reservations.length == 0)
            res.send({ error: "Select one or more avalible reservations" });
          else {
            let newtoken = token.getToken({
              name: name,
              email: email,
              reservations: reservations,
            });
            sengrid(resers, newtoken);
            res.json({
              info: "We send you a message to confirm the reservations",
            });
          }
        })
        .catch((err) => {
          let error = new Error("Impossible to parse Id");
          next(error);
        });
    }
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
