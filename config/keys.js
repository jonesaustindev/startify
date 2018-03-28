if (process.env.NODE_ENV === 'production') {
  module.exports = require('mongoURI: process.env.MONGO_URI');
} else {
  module.exports = require('./dev');
}
