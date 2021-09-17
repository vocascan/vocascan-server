const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { Sequelize } = require('sequelize');
const { highlight } = require('cli-highlight');
const { Umzug, SequelizeStorage } = require('umzug');
const { performance } = require('perf_hooks');

const { sqlLogger } = require('../app/config/logger');
const { round } = require('../app/utils');
const config = require('../app/config/config');
const basename = path.basename(__filename);

const db = {};

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
fs.readdirSync(path.resolve('database', 'models'))
  // filter by models
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  // import model
  .forEach((file) => {
    // eslint-disable-next-line global-require
    const model = require(path.resolve('database', 'models', file))(db.sequelize);
    db[model.name] = model;
  });

// associate models
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.migrations = {
  // umzug instance for migrations
  migrations: (() => {
    const migrations = new Umzug({
      migrations: {
        glob: './database/migrations/*.js',
      },
      context: db.sequelize.getQueryInterface(),
      storage: new SequelizeStorage({
        sequelize: db.sequelize,
        modelName: '.migrations',
        timestamps: true,
        operatorsAliases: false,
      }),
    });

    let startMigrationTime = 0;

    migrations.on('migrating', ({ name }) => {
      console.log(chalk.green(`- start ${name.slice(0, -3)}`));
      startMigrationTime = performance.now();
    });

    migrations.on('migrated', () => {
      console.log(
        chalk.green(`- migrated successfully ${chalk.cyan(`(${round(performance.now() - startMigrationTime, 3)}ms)`)}`)
      );
    });

    return migrations;
  })(),

  // apply migrations
  up: ({ migrations: { migrations } }) => {
    const startTime = performance.now();

    console.info(chalk.yellow('Migrating DB...'));

    return migrations
      .up()
      .then(() => {
        console.log(
          chalk.green(`DB migrating complete in ${chalk.cyan(`(${round(performance.now() - startTime, 3)}ms)`)}`)
        );
      })
      .catch((err) => {
        console.log(chalk.red('An Error occurred while seeding'));
        throw err;
      });
  },
};

db.seeders = {
  // umzug instance for seeders
  seeders: (() => {
    const seeders = new Umzug({
      migrations: {
        glob: './database/seeders/*.js',
      },
      context: db.sequelize.getQueryInterface(),
      storage: new SequelizeStorage({
        sequelize: db.sequelize,
        modelName: '.seeders',
        timestamps: true,
        operatorsAliases: false,
      }),
    });

    let startSeedingTime = 0;

    seeders.on('migrating', ({ name }) => {
      console.log(chalk.green(`- start ${name.slice(0, -3)}`));
      startSeedingTime = performance.now();
    });

    seeders.on('migrated', () => {
      console.log(
        chalk.green(`- seeded successfully ${chalk.cyan(`(${round(performance.now() - startSeedingTime, 3)}ms)`)}`)
      );
    });

    return seeders;
  })(),

  // apply seeders
  up: ({ seeders: { seeders } }) => {
    const startTime = performance.now();

    console.info(chalk.yellow('Seeding DB...'));

    return seeders
      .up()
      .then(() => {
        console.log(
          chalk.green(`DB seeding complete in ${chalk.cyan(`(${round(performance.now() - startTime, 3)}ms)`)}`)
        );
      })
      .catch((err) => {
        console.log(chalk.red('An Error occurred while seeding'));
        throw err;
      });
  },
};

module.exports = db;
