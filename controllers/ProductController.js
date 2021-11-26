const Product = require("../models/product");
const Reservation = require("../models/reservation");
const additions = require("../utils/resetAndCreate");

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
    //console.log(product);
    product.save().then((product) => {
      additions.createReservations(product, product.maxDays).then((product) => {
        //console.log(product);
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
