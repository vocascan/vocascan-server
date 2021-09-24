require('dotenv').config();

const path = require('path');
const chalk = require('chalk');
const Joi = require('./joi');
const { mergeDeep, mutateByPath, parseChalkTemplate } = require('../utils');
const { logLevels, logTransportTypes, DEFAULT_CONFIG_PATH } = require('../utils/constants');

const parseEnvConfig = (envs) => {
  return Object.entries(envs).reduce((parsed, [key, env]) => {
    const parts = key.toLowerCase().split('__');

    if (parts.shift() === 'vocascan') {
      mutateByPath(parsed, parts, env);
    }

    return parsed;
  }, {});
};

// parse config file
const configPath = process.env.VOCASCAN_CONFIG || DEFAULT_CONFIG_PATH;
let configFile = {};
if (configPath) {
  const resolvedPath = path.resolve(configPath);

  try {
    // eslint-disable-next-line global-require
    configFile = require(resolvedPath);
  } catch {
    if (configPath !== DEFAULT_CONFIG_PATH) {
      console.log(chalk`{yellow warn:} could not open config file "${resolvedPath}"\n`);
    }
  }
}

// parse environment variables
const configEnv = parseEnvConfig(process.env);

// merge config
const mergedConfig = mergeDeep(configFile, configEnv);

// log deprecated messages
// TODO: remove the following in v2.0.0
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
  DEBUG: 'debug',
};

const deprecatedEnvVars = Object.entries(deprecatedMap)
  .filter(([envName, newPath]) => {
    if (process.env[envName]) {
      mutateByPath(mergedConfig, newPath.split('.'), process.env[envName]);
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

// define logger transport schema
const logSchema = Joi.object({
  mode: Joi.string()
    .valid(...Object.values(logTransportTypes))
    .default('console'),
  level: Joi.string()
    .valid(...Object.keys(logLevels.levels))
    .default('info'),
  colorize: Joi.boolean().default(false),
  enable_default_log: Joi.boolean().default(true),
  enable_sql_log: Joi.boolean().default(false),
  enable_router_log: Joi.boolean().default(false),
  format_default: Joi.string().default('{{.level}}: {{.message}}'),
  format_sql: Joi.string().default('{{.message}}'),
  format_router: Joi.string().default(
    '{{.tokens.remoteAddr}} - "{{.req.user ? _.req.user.username : "no user"}}" {{.tokens.date("clf")}} "{{.tokens.method}} {{.tokens.url}}" {{.tokens.colorizedStatus}} {{.tokens.res("content-length")}} "{{.tokens.userAgent}}" - {{.tokens.responseTime(3)}}ms'
  ),
  json: Joi.boolean().default(false),
  handle_exceptions: Joi.boolean().default(true),
  handle_rejections: Joi.boolean().default(true),

  // specific for console mode
  stderr_levels: Joi.stringArray()
    .items(Joi.valid(...Object.keys(logLevels.levels)))
    .when('mode', { is: 'console', otherwise: Joi.forbidden() }),

  // specific for file mode
  filename: Joi.string().when('mode', { is: 'file', then: Joi.required(), otherwise: Joi.forbidden() }),
  max_size: Joi.number().min(1).when('mode', { is: 'file', otherwise: Joi.forbidden() }),
  max_files: Joi.number().integer().min(1).when('mode', { is: 'file', otherwise: Joi.forbidden() }),
  archive_logs: Joi.boolean().when('mode', { is: 'file', otherwise: Joi.forbidden() }),
});

// define config schema
const configSchema = Joi.object({
  debug: Joi.boolean().default(false),

  server: Joi.object({
    port: Joi.number().default(5000),
    jwt_secret: Joi.string().required(),
    salt_rounds: Joi.number().integer().min(0).max(20).default(10),
  }).required(),

  database: Joi.object({
    connection_url: Joi.string(),
    dialect: Joi.string(),
    storage: Joi.string(),
    host: Joi.string(),
    port: Joi.string(),
    username: Joi.string(),
    password: Joi.string(),
    database: Joi.string(),
  }).required(),

  log: Joi.object({
    // set transport as default mode for log.<transport>.*
    ...Object.values(logTransportTypes).reduce(
      (transports, transportName) => ({
        ...transports,
        [transportName]: logSchema.keys({
          mode: Joi.string()
            .valid(...Object.values(logTransportTypes))
            .default(transportName),
        }),
      }),
      {}
    ),
  })
    .unknown()
    .pattern(Joi.invalid(...Object.values(logTransportTypes)), logSchema)
    .default({}),
});

// validate schema
const { value: config, error: errors } = configSchema.validate(mergedConfig, {
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

module.exports = config;
