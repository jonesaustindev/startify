const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");

// Models //
require("../models/Idea");
const Idea = mongoose.model("ideas");

// ideas
router.get("/", ensureAuthenticated, (req, res) => {
  Idea.find({user: req.user.id})
    .sort({date:"desc"})
    .then(ideas => {
      res.render("ideas/index", {
        ideas: ideas
      });
    });
});

// adding ideas
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("ideas/add");
});

// edit ideas
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
      if(idea.user != req.user.id){
        req.flash("error_msg", "Not Authorized");
        res.redirect("/ideas");
      } else {
        res.render("ideas/edit", {
          idea: idea
        });
      }
    });
});

// post form from idea
router.post("/", ensureAuthenticated, (req, res) => {
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
      description: req.body.description,
      user: req.user.id
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
router.put("/:id", ensureAuthenticated, (req, res) => {
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
});

// delete startup idea
router.delete("/:id", ensureAuthenticated, (req, res) => {
  Idea.remove({_id: req.params.id})
    .then(() => {
      req.flash("success_msg", "Startup deleted");
      res.redirect("/ideas");
    });
});

module.exports = router;
