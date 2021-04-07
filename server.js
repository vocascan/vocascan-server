require('dotenv').config();

const express = require('express');
const chalk = require('chalk');

const { errorConverter, errorHandler } = require('./app/Middleware/error.js');
const ApiError = require('./app/utils/ApiError.js');
const httpStatus = require('http-status');

const routes = require('./routes');
const db = require('./database');

const app = express();

// middleware
app.use(express.json());

// routes
app.use('/', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
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
    app.listen(process.env.PORT, () => {
      console.info(chalk.yellow(`Server is running on port ${process.env.PORT}.`));
    });
  });
