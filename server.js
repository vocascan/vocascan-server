require('./app/config/config').parseConfig();

const config = require('./app/config/config');

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

Promise.resolve()
  // Checks migrations and run them if they are not already applied. To keep
  // track of the executed migrations, a table (and sequelize model) called SequelizeMeta
  // will be automatically created (if it doesn't exist already) and parsed.
  .then(() => db.migrations.up(db))
  .then(() => db.seeders.up(db))

  // start server
  .then(() => {
    app.listen(config.server.port, () => {
      logger.info(chalk.yellow(`Server is running on port ${config.server.port}.`));
    });
  });
