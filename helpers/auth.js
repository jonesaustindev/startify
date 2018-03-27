module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if(req.isAuthenticated()){
      return next();
    }
    req.flash("success_msg", "Sign up or log in to create your idea!");
    res.redirect("/users/signup");
  }
}
