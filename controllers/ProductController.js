const Product = require("../models/product");
const Reservation = require("../models/reservation");
const resetTime = require("../models/resetTime");
const restTime = require("../models/resetTime");

api = {
  get: function (req, res, next) {
    Product.find({}, (err, product) => {
      if (err) res.send(err);
      res.send(product);
    });
  },
  post: function (req, res, next) {
    let product = new Product({
      name: req.body.name,
      maxDays: req.body.maxDays,
      start: req.body.start,
      finish: req.body.finish,
      duration: req.body.duration,
      days: req.body.days,
      reservations: [],
    });
    //console.log(product);
    product.save().then((product) => {
      additions.createReservations(product, product.maxDays).then((product) => {
        console.log(product);
        res.send(product);
      });
    });
  },
  update: function (req, res, next) {
    Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      maxDays: req.body.maxDays,
      start: req.body.start,
      finish: req.body.finish,
      duration: req.body.duration,
      days: req.body.days,
    })
      .then((product) => {
        product.save();
      })
      .then((product) => {
        res.send(product);
      })
      .catch((err) => {
        res.send(err);
      });
  },
  delete: async function (req, res, next) {
    let product = await Product.findById(req.params.id);
    let deleted = await Reservation.deleteMany({
      _id: { $in: product.reservations },
      status: "created",
    });
    await Product.findByIdAndDelete(req.params.id);
    res.send({ status: "success", deleted: deleted });
  },
};
additions = {
  createReservations: async function (product, maxDays, date = new Date()) {
    let count = 0,
      days = 0;
    let newReser = [],
      oldRese = [];
    let newlastDay = new Date();
    while (days < maxDays) {
      let newDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + count,
        product.start
      );
      // console.log(newDate.getDate());

      // verify if the current day is on days available
      if (product.days.indexOf(newDate.getDay()) != -1) {
        // start to create the hours availables
        let finish = product.finish;
        while (newDate.getHours() < finish) {
          //console.log(newDate);
          //console.log(newDate.getHours());
          let reservation = new Reservation({
            date: newDate,
            product: product._id,
          });
          let reser = await reservation.save();
          newReser.push(reser.id);
          // p.reservations.push(reservation._id);
          //increse de hours
          newlastDay = reser.date;
          newDate.setMinutes(product.duration);
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

    for (let i = 0; i < product.reservations.length; i++) {
      let reser = await Reservation.findById(product.reservations[i]);
      if (reser == null) {
        oldRese.push(product.reservations[i]);
      }
    }
    //console.log(oldRese);
    let a = await Product.findByIdAndUpdate(product._id, {
      $pullAll: { reservations: oldRese },
      lastDay: newlastDay,
    });
    //console.log(a);
    await a.save();
    //console.log(a2);

    let p = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: { reservations: newReser },
      },
      { new: true }
    );
    let p2 = await p.save();
    return p2;
  },
  createNewReservations: async function () {
    let products = await Product.find({});
    await products.forEach((product) => {
      let data = product.lastDay;
      data.setDate(data.getDate() + 1);
      this.createReservations(product, 1, data);
    });
  },
  resetAtMidnight: function () {
    restTime.find({}).then((reset) => {
      if (reset.length == 0) {
        console.log("no hay reset");
        let now = new Date();
        let night = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1, // the next day, ...
          0,
          0,
          0 // ...at 00:00:00 hours
        );
        resetTime.create({ reset: night }).then((reset) => {
          this.startReset(reset);
        });
      } else {
        this.startReset(reset[0]);
      }
    });
  },
  startReset: function (reset) {
    let now = new Date();
    let night = reset.reset;
    console.log(now);
    console.log(night);
    let msToMidnight = night.getTime() - now.getTime();
    if (msToMidnight < 0) msToMidnight = 100;
    console.log(msToMidnight);
    setTimeout(function () {
      additions.createNewReservations(); //      <-- This is the function being called at midnight.
      let newTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // the next day, ...
        0,
        0,
        0 // ...at 00:00:00 hours
      );
      resetTime
        .findByIdAndUpdate(reset.id, { reset: newTime })
        .then((reset) => {
          additions.resetAtMidnight();
        });
    }, msToMidnight);
  },
};
module.exports.additions = additions;
module.exports.api = api;
