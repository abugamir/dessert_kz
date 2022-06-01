const express = require("express")
const router = express.Router()

const {
  recipesGet,
  addToWishDessert,
} = require("../controllers/profileController")

const { receptGet } = require("../controllers/receptController")

router.get("/recipes", recipesGet)

router.get("/addToWishDessert/:id", addToWishDessert)

module.exports = router
