const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const forgotPassSchema = new Schema({
  uuid: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("ForgotPassword", forgotPassSchema);
 
