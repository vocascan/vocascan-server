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

  // validate schema
  const { value: parsedConfig, error: errors } = configSchema.validate(mergedConfig, {
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
