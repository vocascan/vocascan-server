const path = require('path');
const chalk = require('chalk');

const { mutateByPath, parseChalkTemplate } = require('../../utils');
const { DEFAULT_CONFIG_PATH } = require('../../utils/constants');

const parseFileConfig = (configPath) => {
  const resolvedPath = path.resolve(process.cwd(), configPath || DEFAULT_CONFIG_PATH);

  try {
    // eslint-disable-next-line global-require
    const config = require(resolvedPath);

    console.log(chalk`{green info:} loaded config file "${resolvedPath}"`);

    return config;
  } catch {
    if (configPath) {
      // incase that the config path is directly set, warn the user
      console.log(chalk`{yellow warn:} could not open config file "${resolvedPath}"`);
    }

    return {};
  }
};

const parseEnvConfig = (envs) => {
  return Object.entries(envs).reduce((parsed, [key, env]) => {
    const parts = key.toLowerCase().split('__');

    if (parts.shift() === 'vocascan') {
      mutateByPath(parsed, parts, env);
    }

    return parsed;
  }, {});
};

const parseDeprecatedConfig = (config) => {
  const deprecatedMap = {
    PORT: 'server.port',
    DB_CONNECTION_URL: 'db.connection_url',
    DB_DIALECT: 'database.dialect',
    DB_STORAGE: 'database.storage',
    DB_HOST: 'database.host',
    DB_PORT: 'database.port',
    DB_USERNAME: 'database.username',
    DB_PASSWORD: 'database.password',
    DB_DATABASE: 'database.database',
    JWT_SECRET: 'server.jwt_secret',
    SALT_ROUNDS: 'server.salt_rounds',
    REGISTRATION_LOCKED: 'service.invite_code',
    DEBUG: 'debug',
  };

  const deprecatedEnvVars = Object.entries(deprecatedMap)
    .filter(([envName, newPath]) => {
      if (process.env[envName]) {
        mutateByPath(config, newPath.split('.'), process.env[envName]);
        return true;
      }

      return false;
    })
    .map(([envName, newPath]) => `{yellow warn:} "${envName}" -> "${newPath}"`);

  if (deprecatedEnvVars.length > 0) {
    console.log(
      parseChalkTemplate(`{yellow.bold warn: ---------- DEPRECATED ----------}
{yellow warn:} The following environment variables are deprecated and will be removed in the next major release. 
{yellow warn:} Use the config file or env schema instead. For more help see the configuration guide.
{yellow warn:} https://docs.vocascan.com/#/vocascan-server/configuration
${deprecatedEnvVars.join('\n')}
{yellow.bold warn: --------------------------------}
  `)
    );
  }
};

module.exports = {
  parseFileConfig,
  parseEnvConfig,
  parseDeprecatedConfig,
};
