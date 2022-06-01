const express = require("express")
const router = express.Router()
const passport = require("passport")

const {
  loginGet,
  loginPost,
  adminCheck,
} = require("../controllers/authorizationController")

router.get("/login", loginGet)

router.post("/login", adminCheck, passport.authenticate("local"), loginPost)

module.exports = router
