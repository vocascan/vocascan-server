const db = require('./seeding.js');

Promise.resolve()
  // Checks migrations and run them if they are not already applied. To keep
  // track of the executed migrations, a table (and sequelize model) called SequelizeMeta
  // will be automatically created (if it doesn't exist already) and parsed.
  .then(() => db.migrations.up(db))
  .then(() => db.seeders.up(db));
