const express = require("express")
const router = express.Router()

const {
  adminGet,
  addUser,
  deleteUser,
  editCheck,
  updateUser,
  sortByCity,
  sortByName,
  addDessert,
  adminUpdateGet,
  upload,
} = require("../controllers/adminController")

router.get("/admin", adminGet)

router.get("/admin_update", adminUpdateGet)

router.post("/addUser", addUser)

router.post("/deleteUser", deleteUser)

router.post("/editCheck", editCheck)

router.post("/updateUser", updateUser)

router.post("/sortName", sortByName)

router.post("/sortCity", sortByCity)

module.exports = router
