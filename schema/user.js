var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose")

const role = {
  admin: "admin",
  basic: "basic",
}
var userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  city: {
    type: String,
  },
  role: {
    type: String,
    default: "basic",
  },
})

userSchema.plugin(passportLocalMongoose)
var User = mongoose.model("user", userSchema)
module.exports = User

