require('dotenv').config();

const express = require('express');
const chalk = require('chalk');

const routes = require('./routes');
const db = require('./database');

const app = express();

// middleware
app.use(express.json());

// routes
app.use('/', routes);

Promise.resolve()
  // Checks migrations and run them if they are not already applied. To keep
  // track of the executed migrations, a table (and sequelize model) called SequelizeMeta
  // will be automatically created (if it doesn't exist already) and parsed.
  .then(() => db.migrations.up(db))
  .then(() => db.seeders.up(db))

  // start server
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.info(
        chalk.yellow(`Server is running on port ${process.env.PORT}.`)
      );
    });
  });
