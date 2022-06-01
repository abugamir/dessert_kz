var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose")

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
  desserts: {
    name: {
      type: String,
    },
    author: {
      type: String,
    },
    time: {
      type: String,
    },
    categories: {
      type: String,
    },
    description: {
      type: String,
    },
    calorie: {
      type: String,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
  },
})

userSchema.plugin(passportLocalMongoose)
const userDB = mongoose.connection.useDb("userDB")
var User = userDB.model("user", userSchema)
module.exports = User
