const Dessert = require("../schema/dessert")
const likedDessert = require("../schema/likedDessert")

exports.receptGet = (req, res) => {
  Dessert.find({}, (err, dessert) => {
    if (err) console.log(err)
    res.render("recept", {
      dessertInfo: dessert,
    })
  })
}

exports.toRecept = (req, res) => {
  likedDessert.findOne({ _id: req.params.id }, (err, dessert) => {
    if (err) console.log(err)
    res.render("recept", {
      dessertInfo: dessert,
    })
  })
}
