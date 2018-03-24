const express = require("express");
const exphbs  = require('express-handlebars');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");

const app = express();

// Connecting to mongoose //
mongoose.connect("mongodb://localhost/startify-db")
  .then(() => console.log("mongodb connected"))
  .catch(err => console.log(err));


//////// Models /////////
require("./models/Idea");
const Idea = mongoose.model("ideas");


/////// middleware ///////
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride("_method"));

app.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

////////// Global Variables //////////
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});



/////////// Routes //////////////

// index
app.get("/", (req, res) => {
  const title = "Welcome";
  res.render("index", {title: title});
});

// about
app.get("/about", (req, res) => {
  res.render("about");
});

// ideas
app.get("/ideas", (req, res) => {
  Idea.find({})
    .sort({date:"desc"})
    .then(ideas => {
      res.render("ideas/index", {
        ideas: ideas
      });
    });
});

// adding ideas
app.get("/ideas/add", (req, res) => {
  res.render("ideas/add");
});

// edit ideas
app.get("/ideas/edit/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
        res.render("ideas/edit", {
          idea: idea
        });
    });
});

// post form from idea
app.post("/ideas", (req, res) => {
  // server side error handling
  let errors = [];

  if(!req.body.name){
    errors.push({text: "Please add a name"});
  }
  if(!req.body.description){
    errors.push({text: "Please add a description"});
  }

  if(errors.length > 0) {
    res.render("ideas/add", {
      errors: errors,
      name: req.body.name,
      description: req.body.description
    });
  } else {
    const newUser = {
      name: req.body.name,
      description: req.body.description
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash("success_msg", "Startup added");
        res.redirect("/ideas");
      });
  }
});

// edit form send changes
app.put("/ideas/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
      // change the values
      idea.name = req.body.name;
      idea.description = req.body.description;

      idea.save()
        .then(idea => {
          req.flash("success_msg", "Startup has been updated");
          res.redirect("/ideas");
        });
    });
})

// delete startup idea
app.delete("/ideas/:id", (req, res) => {
  Idea.remove({_id: req.params.id})
    .then(() => {
      req.flash("success_msg", "Startup deleted");
      res.redirect("/ideas");
    });
});


const port = 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
