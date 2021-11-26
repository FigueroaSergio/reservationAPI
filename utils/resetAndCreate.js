const Product = require("../models/product");
const Reservation = require("../models/reservation");
const restTime = require("../models/resetTime");
module.exports = {
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
        product.start - 1
      );
      // console.log(newDate.getDate());

      // verify if the current day is on days available
      if (product.days.indexOf(newDate.getDay()) != -1) {
        // start to create the hours availables
        let finish = product.finish - 1;
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
          now.getDate(), // the next day, ...
          0,
          0,
          0 // ...at 00:00:00 hours
        );
        resetTime.create({ reset: night, verificado: true }).then((reset) => {
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
    //console.log(now);
    // console.log(night);
    let msToMidnight = night.getTime() - now.getTime();
    if (msToMidnight < 0) msToMidnight = 100;
    // console.log(msToMidnight);
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
