const commander = require('commander');
const chalk = require('chalk');
const { generateRandomString } = require('../app/utils');

const generate = new commander.Command('generate');

const SECRET_TYPES = {
  JWT_SECRET: 'JWT_SECRET',
};

generate.description('generation functions for strings needed for config files');

generate
  .command('secret')
  .description('generate secrets to use in the config file')
  .addArgument(new commander.Argument('<type>').choices(Object.values(SECRET_TYPES)))
  .action((type) => {
    if (type === SECRET_TYPES.JWT_SECRET) {
      return console.log(
        `  Copy-Paste your JWT secret into your configuration file under server.jwt_secret\n  ${chalk.red(
          generateRandomString()
        )}`
      );
    }

    return null;
  });

module.exports = generate;
