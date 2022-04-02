const http = require('http');
const express = require('express');
const chalk = require('chalk');
const httpStatus = require('http-status');

/**
 * Run vocascan server
 * @param {Object} extraConfig extra config can be used to configure the server programmatically
 */
const createServer = async (extraConfig) => {
  let config = require('./app/config/config');

  // config has not been parsed already -> parse it
  if (config.parseConfig) {
    config = config.parseConfig({ extraConfig });
  }

  // init db before loading routes
  const db = require('./database');
  await db.init();

  const { errorConverter, errorHandler } = require('./app/Middleware/ErrorMiddleware.js');
  const LoggingMiddleware = require('./app/Middleware/LoggingMiddleware');
  const SecurityMiddleware = require('./app/Middleware/SecurityMiddleware');
  const ApiError = require('./app/utils/ApiError.js');

  const routes = require('./routes');
  const logger = require('./app/config/logger');

  const server = {};
  server.app = express();
  server.http = http.createServer(server.app);
  server.db = db;
  server.logger = logger;
  server.config = config;

  // logging middleware
  server.app.use(LoggingMiddleware);

  // security
  server.app.use(SecurityMiddleware);

  // middleware
  server.app.use(express.json());

  // routes
  server.app.use('/', routes);

  // send back a 404 error for any unknown api request
  server.app.use((_req, _res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
  });

  // convert error to ApiError, if needed
  server.app.use(errorConverter);

  // handle error
  server.app.use(errorHandler);

  server.start = async () => {
    // Checks migrations and run them if they are not already applied. To keep
    // track of the executed migrations, a table (and sequelize model) called .migrations
    // will be automatically created (if it doesn't exist already) and parsed.
    await db.migrations.up();
    await db.seeders.up();

    // start server
    return new Promise((resolve) => {
      server.http.listen(config.server.port, () => {
        logger.info(chalk.yellow(`Server is running on port ${config.server.port}.`));
        resolve(server);
      });
    });
  };

  server.stop = async () => {
    server.http.close();
  };

  return server;
};

// run runServer function if it was directly executed to keep downwards compatibility
if (require.main === module) {
  createServer().then((server) => server.start());
}

module.exports = {
  createServer,
  version: require('./package.json').version,
};
