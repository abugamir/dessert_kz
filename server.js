const express = require("express")
const multer = require("multer")
const app = express()
const bodyParser = require("body-parser")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const cookie = require("cookie-parser")
const session = require("express-session")
const path = require("path")

const User = require("./schema/user")
const Dessert = require("./schema/dessert")

const port = process.env.PORT || 2000
//mongodb connection
const dbURI =
  "mongodb+srv://amir:amir@amircluster.obxua.mongodb.net/?retryWrites=true&w=majority"
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log("Database connected"))
  .catch((err) => console.log(err))

//storage
const storage = multer.diskStorage({
  destination: "public/img/uploads",
  filename: (req, file, cb) => {
    console.log(file)
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    )
  },
})

const upload = multer({
  storage: storage,
}).single("dessert_photo")

app.use(cookie())
app.use(
  express.urlencoded({
    extended: false,
  })
)

app.use(bodyParser.urlencoded({ extended: true }))
// required for passport session
app.use(
  session({
    secret: "secrettexthere",
    saveUninitialized: true,
    resave: true,
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

const indexRouter = require("./routes/indexRouter")
const loginRouter = require("./routes/loginRouter")
const registrationRouter = require("./routes/registrationRouter")
const adminRouter = require("./routes/adminRouter")
const profileRouter = require("./routes/profileRouter")
const recipesRouter = require("./routes/recipesRouter")
const receptRouter = require("./routes/receptRouter")

app.use(
  indexRouter,
  loginRouter,
  registrationRouter,
  adminRouter,
  profileRouter,
  recipesRouter,
  receptRouter
)

app.get("/rulet", (req, res) => {
  res.render("rulet")
})

app.get("/honeydew", (req, res) => {
  res.render("honeydew")
})

app.get("/milk", (req, res) => {
  res.render("moloko")
})

app.get("/tartaletka", (req, res) => {
  res.render("tartles")
})

app.post("/addDessert", (req, res) => {
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
      })

      newDessert.save()

      Dessert.find({}, function (err, dessert) {
        User.find({ username: req.cookies.username }, function (err, user) {
          res.render("profile", {
            userInfo: user,
            login: req.cookies.islog,
            dessertInfo: dessert,
          })
        })
      })
    }
  })
})

app.listen(port, () => console.info("Server on port " + port))
