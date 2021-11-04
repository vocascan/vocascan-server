const chalk = require('chalk');
const { Umzug, SequelizeStorage } = require('umzug');
const { performance } = require('perf_hooks');

const { round } = require('../app/utils');
const logger = require('../app/config/logger');

class Migration {
  constructor({ db, name, displayName, umzugOptions }) {
    this.migrationInterface = new Umzug({
      migrations: {
        glob: `./database/${name}/*.js`,
      },
      context: db.sequelize.getQueryInterface(),
      storage: new SequelizeStorage({
        sequelize: db.sequelize,
        modelName: `.${name}`,
        timestamps: true,
      }),
      ...umzugOptions,
    });

    this.db = db;
    this.name = name;
    this.displayName = displayName;
    this.startMigrationTime = 0;

    this.attachHandlers();
  }

  attachHandlers() {
    this.migrationInterface.on('migrating', ({ name }) => {
      logger.info(chalk`- ${this.displayName} ${name.slice(0, -3)}`);
      this.startMigrationTime = performance.now();
    });

    this.migrationInterface.on('migrated', () => {
      logger.info(chalk`  {green ✓} done {cyan (${round(performance.now() - this.startMigrationTime, 3)}ms)}`);
    });
  }

  up() {
    const startTime = performance.now();

    logger.info(chalk`{yellow ${this.displayName}...}`);

    return this.migrationInterface
      .up()
      .then(() => {
        logger.info(chalk`{green ✓} ${this.displayName} done in {cyan (${round(performance.now() - startTime, 3)}ms)}`);
      })
      .catch((err) => {
        logger.error(`An Error occurred while ${this.displayName}`);
        throw err;
      });
  }

  // TODO: add down functionality
  static down() {}
}

module.exports = Migration;
