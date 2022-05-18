const cookie = require("cookie-parser")
const express = require("express")
const passport = require("passport")
const mongodb = require("mongodb")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const session = require("express-session")
const LocalStrategy = require("passport-local").Strategy
const passportLocalMongoose = require("passport-local-mongoose")
const app = express()
const port = process.env.PORT || 2000

const User = require("./schema/user")
const role = require("./schema/user")
const { check, validationResult } = require("express-validator")

//mongodb connection
const dbURI =
  "mongodb+srv://amir:amir@amircluster.obxua.mongodb.net/amirDB?retryWrites=true&w=majority"
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log("Database connected"))
  .catch((err) => console.log(err))

app.use(cookie())
app.use(
  express.urlencoded({
    extended: false,
  })
)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  session({
    secret: "SECRET",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
)

app.set("view engine", "/views")
app.set("view engine", "ejs")

app.use(bodyParser.json())

app.use(express.static("public"))

app.use("/css", express.static(__dirname + "public/css"))
app.use("/js", express.static(__dirname + "public/js"))
app.use("/img", express.static(__dirname + "public/img"))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//////
app.get("/", (req, res) => {
  res.render("index.ejs")
})

app.get("/login", (req, res) => {
  res.render("login.ejs", {
    error: "All good",
  })
})

app.post(
  "/login",
  passport.authenticate("local"),
  authRole(role.admin),
  function (req, res) {
    const username = req.body.username //requesting data from body
    const password = req.body.password

    res.cookie("username", username) //then storing it
    res.cookie("password", password)

    var loginTime = new Date().getTime()
    res.cookie("loginTime", loginTime)
    res.clearCookie("userEdit")
    res.redirect("/profile")
  }
)

app.get("/registration", (req, res) => {
  res.render("registration.ejs")
})

app.post(
  "/registration",
  [
    check("password", "Password must be at least 7 characters")
      .exists()
      .matches(/.{7,}/),
    check("password", "Password must have at least one special character")
      .exists()
      .matches(/^(?=.*[!@#$&*])/),
    check("password", "Password must have at least one uppercase letter")
      .exists()
      .matches(/(?=.*[A-Z])/),
    check("password", "Password must have at least one lowercase letter")
      .exists()
      .matches(/(?=.*[a-z])/),
    check("email", "Email is not valid").isEmail().normalizeEmail(),
  ],
  (req, res) => {
    //db
    var newUser = new User({
      username: req.body.username,
      email: req.body.email,
      city: req.body.city,
    })
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
)

app.get("/profile", (req, res) => {
  User.find({ username: req.cookies.username }, function (err, user) {
    res.render("profile", {
      userInfo: user,
    })
  })
})

//main page
app.get("/main", (req, res) => {
  res.cookie("time", time)

  res.render("main.ejs", {
    username: req.cookies.username, //data sending
    name: req.cookies.name,
    email: req.cookies.email,
  })
})

app.get("/admin", (req, res) => {
  User.find({}, function (err, user) {
    res.render("admin", {
      userInfo: user,
    })
  })
})

app.post("/addUser", (req, res) => {
  var newUser = new User({
    username: req.body.username,
    email: req.body.email,
    city: req.body.city,
  })

  User.register(newUser, req.body.password, function (err, a) {
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
})

app.post("/deleteUser", (req, res) => {
  const username = req.body.username1
  User.deleteOne({ username: username }, function (err) {
    if (err) console.log(err)
  })

  User.find({}, function (err, user) {
    res.render("admin", {
      userInfo: user,
    })
  })
})

app.post("/editCheck", (req, res) => {
  var userEdit = req.body.username2
  res.cookie("userEdit", userEdit)

  if (
    ({ username: req.body.username },
    function (err) {
      if (err) console.log(err)
    })
  )
    res.render("admin_update")
})

app.post("/updateUser", (req, res) => {
  User.findOneAndUpdate(
    { username: req.cookies.userEdit },
    { username: req.body.username },
    { new: true },
    function (err, data) {
      if (err) console.log(err)
    }
  )
  User.findOneAndUpdate(
    { username: req.cookies.userEdit },
    { email: req.body.email },
    { new: true },
    function (err, data) {
      if (err) console.log(err)
    }
  )
  User.findOneAndUpdate(
    { username: req.cookies.userEdit },
    { city: req.body.city },
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
})
app.post("/sortName", (req, res) => {
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
})

app.post("/sortCity", (req, res) => {
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
})

//logout
app.get("/logout", function (req, res) {
  //deleting cookie
  res.clearCookie("username")
  res.clearCookie("name")
  res.clearCookie("country")
  res.clearCookie("email")
  res.clearCookie("time")
  res.clearCookie("loginTime")

  res.redirect("/login")
})

//authRole
function authRole(role) {
  return (req, res, next) => {
    if (req.user.role != role) {
      User.find({}, function (err, user) {
        res.render("admin", {
          userInfo: user,
        })
      })
    }
    next()
  }
}

app.listen(port, () => console.info("Server on port " + port))
