const express = require("express")
const router = express.Router()

const {
  profileGet,
  profileEditGet,
  editUserProfile,
  deleteDessert,
} = require("../controllers/profileController")
const { logout } = require("../controllers/authorizationController")

router.get("/profile", profileGet)

router.get("/profile_edit", profileEditGet)

router.get("/logout", logout)

router.post("/editUserProfile", editUserProfile)

router.get("/deleteDessert/:id", deleteDessert)

module.exports = router
