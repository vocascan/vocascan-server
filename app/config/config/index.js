const chalk = require('chalk');
const dotenv = require('dotenv');

const { mergeDeep } = require('../../utils');
const { parseFileConfig, parseEnvConfig, parseDeprecatedConfig } = require('./parsers');
const configSchema = require('./schema');

const parseConfig = (path) => {
  // parse .env file
  dotenv.config();

  // parse config file
  const configFile = parseFileConfig(path || process.env.VOCASCAN_CONFIG);

  // parse environment variables
  const configEnv = parseEnvConfig(process.env);

  // merge config
  const mergedConfig = mergeDeep(configFile, configEnv);

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
