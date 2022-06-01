const User = require("../schema/user")
const Dessert = require("../schema/dessert")
const Admin = require("../schema/admin")
const passport = require("passport")

const multer = require("multer")
const path = require("path")

const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    console.log(file)
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: Storage,
})

exports.adminGet = (req, res) => {
  User.find({}, function (err, user) {
    res.render("admin", {
      userInfo: user,
    })
  })
}

exports.adminUpdateGet = (req, res) => {
  res.render("admin_update")
}

exports.addUser = (req, res) => {
  var newUser = new Admin({
    username: req.body.username,
    email: req.body.email,
  })

  Admin.register(newUser, req.body.password, function (err, a) {
    if (err) {
      console.log(err)
    }

    passport.authenticate("local")(req, res, function () {
      User.find({}, function (err, user) {
        res.render("admin", {
          userInfo: user,
        })
      })
    })
  })
}

exports.deleteUser = (req, res) => {
  const username = req.body.username1
  User.deleteOne({ username: username }, function (err) {
    if (err) console.log(err)
  })

  User.find({}, function (err, user) {
    res.render("admin", {
      userInfo: user,
    })
  })
}

exports.editCheck = (req, res) => {
  var userEdit = req.body.username2
  res.cookie("userEdit", userEdit)

  if (
    ({ username: req.body.username },
    function (err) {
      if (err) console.log(err)
    })
  )
    res.render("admin_update")
}

exports.updateUser = (req, res) => {
  User.findOneAndUpdate(
    { username: req.cookies.userEdit },
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
    res.render("admin", {
      userInfo: user,
    })
  })
}

exports.sortByName = (req, res) => {
  User.find(
    {},
    null,
    { sort: { username: 1 }, collation: { locale: "en" } },
    function (err, user) {
      res.render("admin", {
        userInfo: user,
      })
    }
  )
}

exports.sortByCity = (req, res) => {
  User.find(
    {},
    null,
    { sort: { city: 1 }, collation: { locale: "en" } },
    function (err, user) {
      res.render("admin", {
        userInfo: user,
      })
    }
  )
}

exports.upload = (req, res) => {
  upload(req, res, (err) => {
    if (err) console.log(err)
    else {
      var newDessert = new Dessert({
        name: req.body.dessert_name,
        author: req.body.dessert_author,
        time: req.body.dessert_time,
        description: req.body.dessert_desc,
        calorie: req.body.dessert_calorie,
        categories: req.body.dessert_categ,
        image: {
          data: req.file.filename,
          contentType: "image/png",
        },
      })

      newDessert.save()

      res.redirect("/admin")
    }
  })
}

exports.addDessert = (req, res) => {
  var newDessert = new Dessert({
    name: req.body.dessert_name,
    author: req.body.dessert_author,
    time: req.body.dessert_time,
    description: req.body.dessert_desc,
    calorie: req.body.dessert_calorie,
    categories: req.body.dessert_categ,
  })

  newDessert.save()

  res.redirect("/admin")
}
