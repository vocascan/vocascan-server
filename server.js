const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const httpStatus = require('http-status');
const eta = require('eta');

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
  const mailer = require('./app/config/mailer');

  const server = {};
  server.app = express();
  server.http = http.createServer(server.app);
  server.db = db;
  server.logger = logger;
  server.config = config;

  // template engine
  server.app.engine('eta', eta.renderFile);
  server.app.set('view engine', 'eta');
  server.app.set('views', path.resolve(__dirname, './app/Templates/views'));
  server.app.use((_req, res, next) => {
    res.locals.baseUrl = config.server.base_url;
    next();
  });

  // set body parser limit
  server.app.use(bodyParser.json({ limit: config.server.max_file_upload }));
  server.app.use(bodyParser.urlencoded({ extended: true, limit: config.server.max_file_upload }));

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

  server.migrate = async () => {
    // Checks migrations and run them if they are not already applied. To keep
    // track of the executed migrations, a table (and sequelize model) called .migrations
    // will be automatically created (if it doesn't exist already) and parsed.
    await db.migrations.up();
    await db.seeders.up();
  };

  server.start = async ({ migrate = true } = {}) => {
    if (migrate) {
      await server.migrate();
    }

    // initialize mailer
    await mailer.init();

    // start server
    return new Promise((resolve) => {
      server.http.listen(config.server.port, () => {
        logger.info(chalk.yellow(`Server is running on port ${config.server.port}.`));
        resolve();
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
