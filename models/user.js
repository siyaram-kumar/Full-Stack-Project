const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: false, // optional now
    unique: true,
    sparse: true
  },
  profileImage: {
    type: String,
    default: "/images/default-user.png"
  },
  avatarColor: {
    type: String // for first-letter color
  },
  // OTP verification fields
  otp: Number,
  otpExpires: Date,
  isVerified: {
    type: Boolean,
    default: false
  }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
