const path = require('path');
const chalk = require('chalk');
const dotenv = require('dotenv');

const { mergeDeep } = require('../../utils');
const { parseFileConfig, parseEnvConfig, parseDeprecatedConfig } = require('./parsers');
const configSchema = require('./schema');

const parseConfig = ({ configPath, extraConfig = {} } = {}) => {
  // parse .env file
  const envFilePath = path.resolve(process.cwd(), '.env');
  const result = dotenv.config({ path: envFilePath });
  if (result.parsed) {
    console.log(chalk`{green info:} loaded env file "${envFilePath}"`);
  }

  // parse config file
  const configFile = parseFileConfig(configPath || process.env.VOCASCAN_CONFIG);

  // parse environment variables
  const configEnv = parseEnvConfig(process.env);

  // merge config
  const mergedConfig = mergeDeep(configFile, configEnv, extraConfig);

  // log deprecated messages
  // TODO: remove the deprecated config parser in v2.0.0
  parseDeprecatedConfig(mergedConfig);

  // check if user haven't set any config option
  if (Object.keys(mergedConfig).length === 0) {
    console.log(
      chalk`{red error:} No config options detected, neither via the environment variables nor via a configuration file.`
    );

    process.exit(1);
  }

  // define server and database key in merged Config, so that JOI output understandable error messages
  const mergedConfigWithDefaultKeys = {
    server: {},
    database: {},
    log: {
      console: { colorize: true },
    },
    api: {},
    service: {},
    ...mergedConfig,
  };

  // validate schema
  const { value: parsedConfig, error: errors } = configSchema.validate(mergedConfigWithDefaultKeys, {
    abortEarly: false,
  });

  // check for errors
  if (errors) {
    // log validation errors
    for (const error of errors.details) {
      console.error(chalk`{red error:}`, error.message);
    }

    process.exit(1);
  }

  module.exports = parsedConfig;

  return parsedConfig;
};

module.exports = {
  parseConfig,
};
