const express = require("express");
const path = require("path");
const exphbs  = require('express-handlebars');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");

const app = express();

app.use(express.static(path.join(__dirname, '/public')));

// Config for db
const db = require("./config/database");


// Connecting to mongoose //
mongoose.connect(db.mongoURI)
  .then(() => console.log("mongodb connected"))
  .catch(err => console.log(err));

// Connecting Routes //
const ideas = require("./routes/ideas");
const users = require("./routes/users");

// Config for passport
require("./config/passport")(passport);





/////// middleware ///////
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// public folder now express static
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride("_method"));

// express session middleware
app.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

////////// Global Variables //////////
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});



/////////// Routes //////////////

// index
app.get("/", (req, res) => {
  const title = "Startify";
  res.render("index", {title: title});
});

// about
app.get("/about", (req, res) => {
  res.render("about");
});



// Use Routes //
app.use("/ideas", ideas);
app.use("/users", users);




const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
