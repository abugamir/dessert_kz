const passport = require("passport")
const mongoose = require("mongoose")
const LocalStrategy = require("passport-local").Strategy

const { validationResult } = require("express-validator")

const User = require("../schema/user")
const Admin = require("../schema/admin")

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

exports.loginGet = (req, res) => {
  res.render("login.ejs", {
    error: "All good",
  })
}

exports.loginPost = (req, res) => {
  const username = req.body.username //requesting data from body
  const password = req.body.password

  res.cookie("username", username) //then storing it
  res.cookie("password", password)
  res.cookie("islog", "islog")

  var loginTime = new Date().getTime()
  res.cookie("loginTime", loginTime)
  res.clearCookie("userEdit")
  res.redirect("/profile")
}

exports.adminCheck = (req, res, next) => {
  Admin.findOne({ username: req.body.username }, function (err, admin) {
    if (err) console.log(err)
    if (admin) {
      res.redirect("/admin")
    }
    next()
  })
}

exports.registerGet = (req, res) => {
  res.render("registration.ejs")
}

exports.registerPost = (req, res) => {
  //db
  var newUser = new User({
    username: req.body.username,
    email: req.body.email,
    city: req.body.city,
  })

  res.cookie("islog", "islog")

  const errors = validationResult(req)
  console.log(errors)

  if (!errors.isEmpty()) {
    const alert = errors.array()
    res.render("registration", {
      alert,
    })
  } else {
    const username = req.body.username //requesting data from body
    const password = req.body.password
    const email = req.body.email
    const city = req.body.city

    res.cookie("username", username) //then storing it
    res.cookie("password", password)
    res.cookie("email", email)
    res.cookie("city", city)

    User.register(newUser, req.body.password, function (err, a) {
      if (err) {
        console.log(err)
        return res.redirect("/registration")
      }

      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile")
      })
    })
  }
}

exports.logout = (req, res) => {
  //deleting cookie
  req.logout()

  res.clearCookie("username")
  res.clearCookie("name")
  res.clearCookie("country")
  res.clearCookie("email")
  res.clearCookie("time")
  res.clearCookie("loginTime")
  res.clearCookie("islog")
  var db = mongoose.connection.useDb("dessertDB")

  db.collection("likeddesserts").drop()

  req.session.destroy(function (err) {
    res.redirect("/")
  })
}
