const reservationProduct = require("../models/reservationProduct");
const Reservation = require("../models/reservation");
module.exports = {
  get: function (req, res, next) {
    reservationProduct.find({}, (err, reservationRules) => {
      if (err) res.send(err);
      res.send(reservationRules);
    });
  },
  post: function (req, res, next) {
    product = new reservationProduct({
      name: req.body.name,
      maxDays: req.body.maxDays,
      start: req.body.startMorning,
      finish: req.body.finishMorning,
      duration: req.body.duration,
      days: req.body.days,
      reservations: [],
    });

    product.save().then((product) => {
      res.send(product);
      createReservations(product);
    });
  },
  update: function (req, res, next) {
    reservationProduct
      .findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        maxDays: req.body.maxDays,
        start: req.body.startMorning,
        finish: req.body.finishMorning,
        duration: req.body.duration,
        days: req.body.days,
      })
      .then((reservation) => {
        reservation.save();
      })
      .then((reservation) => {
        res.send(reservation);
      })
      .catch((err) => {
        res.send(err);
      });
  },
  delete: function (req, res, next) {
    reservationProduct.findByIdAndDelete(req.params.id).then((product) => {
      res.status = 200;
      res.send({ status: "success" });
    });
  },
};
async function createReservations(p) {
  let now = new Date();
  let count = 0;
  let days = 0;
  let newReser = [];
  while (days < p.maxDays) {
    let newDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + count,
      p.start
    );
    // console.log(newDate.getDate());

    // verify if the current day is on days available
    if (p.days.indexOf(newDate.getDay()) != -1) {
      // start to create the hours availables
      while (newDate.getHours() < p.finish) {
        //console.log(newDate);
        //console.log(newDate.getHours());
        let reservation = new Reservation({ date: newDate });
        let reser = await reservation.save();
        newReser.push(reser.id);

        // p.reservations.push(reservation._id);
        //increse de hours
        newDate.setMinutes(p.duration);
      }
    } else {
      count++;
      continue;
    }
    count++;
    days++;
    // console.log(`${days}-${count}`);
  }
  //console.log(newReser);
  reservationProduct
    .findByIdAndUpdate(p._id, { reservations: newReser })
    .then((product) => {
      product.save();
    });
}
