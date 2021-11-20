const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const { highlight } = require('cli-highlight');

const basename = path.basename(__filename);

const db = {};

db.init = async () => {
  /* eslint-disable global-require */
  const { sqlLogger } = require('../app/config/logger');
  const config = require('../app/config/config');
  const Migration = require('./Migration');
  /* eslint-enable global-require */

  const sequelizeOptions = {
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    dialect: config.database.dialect,
    storage: config.database.storage,
    logging: (msg) => {
      sqlLogger.log('sql', highlight(msg, { language: 'sql', ignoreIllegals: true }));
    },
  };

  // initialize sequelize instance
  if (config.database.connection_url) {
    db.sequelize = new Sequelize(config.database.connection_url, sequelizeOptions);
  } else {
    db.sequelize = new Sequelize(sequelizeOptions);
  }

  // get all models
  fs.readdirSync(path.resolve(__dirname, 'models'))
    // filter by models
    .filter((file) => {
      return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
    })
    // import model
    .forEach((file) => {
      // eslint-disable-next-line global-require
      const model = require(path.resolve(__dirname, 'models', file))(db.sequelize);
      db[model.name] = model;
    });

  // associate models
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.migrations = new Migration({ db, name: 'migrations', displayName: 'migrating', logging: false });
  db.seeders = new Migration({ db, name: 'seeders', displayName: 'seeding', logging: false });
};

module.exports = db;
