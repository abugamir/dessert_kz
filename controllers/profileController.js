const cookie = require("cookie-parser")

const User = require("../schema/user")
const Dessert = require("../schema/dessert")
const likedDessert = require("../schema/likedDessert")

exports.profileGet = (req, res) => {
  likedDessert.find({}, function (err, dessert) {
    User.find({ username: req.cookies.username }, function (err, user) {
      res.render("profile", {
        userInfo: user,
        dessertInfo: dessert,
        login: req.cookies.islog,
      })
    })
  })
}

exports.profileEditGet = (req, res) => {
  User.find({ username: req.cookies.username }, function (err, user) {
    res.render("profile_edit", {
      userInfo: user,
      login: req.cookies.islog,
    })
  })
}

exports.editUserProfile = (req, res) => {
  User.findOneAndUpdate(
    { username: req.cookies.username },
    {
      username: req.body.username,
      email: req.body.email,
      city: req.body.city,
    },
    { new: true },
    function (err, data) {
      if (err) console.log(err)
    }
  )

  User.find({}, function (err, user) {
    res.render("profile_edit", {
      userInfo: user,
    })
  })
}

exports.deleteDessert = (req, res) => {
  likedDessert.findOneAndDelete({ _id: req.params.id }, function (err) {
    if (err) console.log(err)
  })

  likedDessert.find({}, function (err, dessert) {
    User.find({ username: req.cookies.username }, function (err, user) {
      res.redirect("/profile")
    })
  })
}

exports.recipesGet = (req, res) => {
  Dessert.find({}, function (err, dessert) {
    User.find({ username: req.cookies.username }, function (err, user) {
      res.render("recipes", {
        userInfo: user,
        dessertInfo: dessert,
        login: req.cookies.islog,
      })
    })
  })
}

exports.addToWishDessert = (req, res) => {
  Dessert.findOne({ _id: req.params.id }, (err, dessert) => {
    if (err) console.log(err)
    else {
      var LikedDessert = new likedDessert({
        name: dessert.name,
        author: dessert.author,
        time: dessert.time,
        calorie: dessert.calorie,
        categories: dessert.categories,
        description: dessert.description,
        link: dessert.link,
      })

      LikedDessert.save()

      res.redirect("/recipes")
    }
  })
}
