/**
 * Run vocascan server
 * @param {Object} extraConfig extra config can be used to configure the server programmatically
 */
const runServer = async (extraConfig) => {
  let config = require('./app/config/config');

  // config has not been parsed already -> parse it
  if (config.parseConfig) {
    config = config.parseConfig({ extraConfig });
  }

  const http = require('http');
  const express = require('express');
  const chalk = require('chalk');
  const httpStatus = require('http-status');

  const { errorConverter, errorHandler } = require('./app/Middleware/ErrorMiddleware.js');
  const LoggingMiddleware = require('./app/Middleware/LoggingMiddleware');
  const ApiError = require('./app/utils/ApiError.js');

  const routes = require('./routes');
  const db = require('./database');
  const logger = require('./app/config/logger');

  const app = express();
  const server = http.createServer(app);

  // logging middleware
  app.use(LoggingMiddleware);

  // middleware
  app.use(express.json());

  // routes
  app.use('/', routes);

  // send back a 404 error for any unknown api request
  app.use((_req, _res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
  });

  // convert error to ApiError, if needed
  app.use(errorConverter);

  // handle error
  app.use(errorHandler);

  // init db
  await db.init();

  // Checks migrations and run them if they are not already applied. To keep
  // track of the executed migrations, a table (and sequelize model) called .migrations
  // will be automatically created (if it doesn't exist already) and parsed.
  await db.migrations.up();
  await db.seeders.up();

  // start server
  return new Promise((resolve) => {
    server.listen(config.server.port, () => {
      logger.info(chalk.yellow(`Server is running on port ${config.server.port}.`));
      resolve(server);
    });
  });
};

// run runServer function if it was directly executed to keep downwards compatibility
if (require.main === module) {
  runServer();
}

module.exports = runServer;
