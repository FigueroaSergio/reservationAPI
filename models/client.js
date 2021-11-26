const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var client = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  reservations: [
    {
      type: Schema.Types.ObjectId,
      ref: "reservation",
      unique: true,
    },
  ],
});
module.exports = mongoose.model("client", client);
