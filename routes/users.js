const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

// Models //
require("../models/User");
const User = mongoose.model("users");

// login
router.get("/login", (req, res) => {
  res.render("users/login");
});

// signup
router.get("/signup", (req, res) => {
  res.render("users/signup");
});

// login form post
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// signup form POST
router.post("/signup", (req, res) => {
  // form validation
  let errors = [];

  if(req.body.password != req.body.password2){
    errors.push({text: "Passwords do not match"});
  }

  if(req.body.password.length < 4){
    errors.push({text: "Password must be at least 4 characters"});
  }

  if(errors.length > 0){
    res.render("users/signup", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({email: req.body.email})
      .then(user => {
        if(user) {
          req.flash("error_msg", "Email already in use");
          res.redirect("/users/signup");
        } else {
          // new user is created, grabbing data from form
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });
          // encrypt password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash("success_msg", "You are now signed up!");
                  res.redirect("/users/login");
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
  }
});

// user logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Successfully logged out");
  res.redirect("/users/login");
});



module.exports = router;
