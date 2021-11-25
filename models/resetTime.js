const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Reset = new Schema({
  reset: {
    type: Date,
    require: true,
  },
});
module.exports = mongoose.model("reset", Reset);
