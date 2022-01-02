const cors = require('cors');

const config = require('../config/config');

const CorsMiddleware = cors({
  origin: typeof config.server.cors !== 'boolean' && config.server.cors.includes('*') ? '*' : config.server.cors,
});

module.exports = [CorsMiddleware];
