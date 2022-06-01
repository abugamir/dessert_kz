var mongoose = require("mongoose")

var dessertSchema = new mongoose.Schema({
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
})
const dessertDB = mongoose.connection.useDb("dessertDB")
var likedDessert = dessertDB.model("likedDessert", dessertSchema)
module.exports = likedDessert
