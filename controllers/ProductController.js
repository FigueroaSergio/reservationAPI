const product = require("../models/product");
const Product = require("../models/product");
const Reservation = require("../models/reservation");
module.exports = {
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
    console.log(product);
    product.save().then((product) => {
      res.send(product);
      createReservations(product);
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
    res.send({ status: "success" });
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
        let reservation = new Reservation({ date: newDate, product: p._id });
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
  Product.findByIdAndUpdate(p._id, { reservations: newReser }).then(
    (product) => {
      product.save();
    }
  );
}

function resetAtMidnight() {
  let now = new Date();
  let night = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(), // the next hour, ...
    now.getMinutes() + 10,
    0 // ...at 00:00:00 hours
  );
  console.log(now);
  console.log(night);
  let msToMidnight = night.getTime() - now.getTime();

  setTimeout(function () {
    reset(); //      <-- This is the function being called at midnight.
    resetAtMidnight(); //      Then, reset again next midnight.
  }, msToMidnight);
}
