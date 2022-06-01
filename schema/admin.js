var mongoose = require("mongoose")

var adminSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    default: "admin",
  },
})

const userDB = mongoose.connection.useDb("userDB")
var Admin = userDB.model("admin", adminSchema)
module.exports = Admin
