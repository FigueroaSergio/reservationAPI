const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var reservation = new Schema({
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["created", "cancelled", "completed", "reserved"],
    default: "created",
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: "client",
  },
  product: {
    type: String,
    required: true,
  },
});
reservation.index(
  { date: 1 },
  { expireAfterSeconds: 0, partialFilterExpression: { status: "created" } }
);
module.exports = mongoose.model("reservation", reservation);
