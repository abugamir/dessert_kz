const express = require("express")
const router = express.Router()

const { receptGet, toRecept } = require("../controllers/receptController")

router.get("/recept", receptGet)

router.get("/toRecept/:id", toRecept)

module.exports = router
