if(process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI: "mongodb://ajones:Shadow240@ds131826.mlab.com:31826/startify-prod"
  }
} else {
  module.exports = {
    mongoURI: "mongodb://localhost/startify-db"
  }
}
