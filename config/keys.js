if (process.env.NODE_ENV === 'production') {
  module.exports = require(process.env.MONGO_URI);
} else {
  module.exports = require('./dev');
}
