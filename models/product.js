const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var Product = new Schema({
  name: {
    type: String,
    required: true,
  },
  maxDays: {
    type: Number,
    default: 5,
    min: 1,
  },
  start: {
    type: Number,
    default: 7,
  },
  finish: {
    type: Number,
    default: 12,
    max: 24,
  },
  duration: {
    type: Number,
    default: 60,
  },
  // 0 sunday, 1 monday,2 tuesday,.... 6 saturday
  days: [
    {
      type: Number,
      min: 0,
      max: 6,
    },
  ],
  lastDay: {
    type: Date,
  },
  reservations: [
    {
      type: Schema.Types.ObjectId,
      ref: "reservation",
    },
  ],
});

module.exports = mongoose.model("product", Product);
