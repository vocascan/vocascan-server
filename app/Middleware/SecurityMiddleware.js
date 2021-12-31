const cors = require('cors');

const config = require('../config/config');

const CorsMiddleware = cors({
  origin: config.server.cors,
});

module.exports = [CorsMiddleware];
