const express = require("express")
const User = require("../schema/user")
const router = express.Router()

router.get("/", (req, res) => {
  User.find({ username: req.cookies.username }, function (err, user) {
    res.render("index.ejs", {
      userInfo: user,
      login: req.cookies.islog,
    })
  })
})

module.exports = router
