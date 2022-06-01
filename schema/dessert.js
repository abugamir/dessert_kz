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
  image: {
    data: Buffer,
    contentType: String,
  },
})
const dessertDB = mongoose.connection.useDb("dessertDB")
var Dessert = dessertDB.model("dessert", dessertSchema)
module.exports = Dessert
