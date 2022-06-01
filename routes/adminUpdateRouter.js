const express = require("express")
const router = express.Router()

router.get("/admin_update", (req, res) => {
  res.render("admin_update")
})

module.exports = router
