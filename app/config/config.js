require('dotenv').config();

const path = require('path');
const chalk = require('chalk');
const Joi = require('./joi');
const { mergeDeep, mutateByPath } = require('../utils');
const { logLevels, loggingTransportTypes } = require('../utils/constants');

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
const configPath = process.env.VOCASCAN_CONFIG;
let configFile = {};
if (configPath) {
  const resolvedPath = path.resolve(configPath);

  try {
    // eslint-disable-next-line global-require
    configFile = require(resolvedPath);
  } catch {
    console.log(chalk`{yellow warn:} could not open config file "${resolvedPath}"`);
  }
}

// parse environment variables
const configEnv = parseEnvConfig(process.env);

// merge config
const mergedConfig = mergeDeep(configFile, configEnv);

// define logger transport schema
const logSchema = Joi.object({
  mode: Joi.string()
    .valid(...Object.values(loggingTransportTypes))
    .default('console'),
  level: Joi.string()
    .valid(...Object.keys(logLevels.levels))
    .default('info'),
  colorize: Joi.boolean().default(false),
  enable_default_log: Joi.boolean().default(true),
  enable_sql_log: Joi.boolean().default(false),
  enable_router_log: Joi.boolean().default(false),
  format_default: Joi.string().default('{{level}}: {{message}}'),
  format_sql: Joi.string().default('{{message}}'),
  format_router: Joi.string().default('{{level}}: {{message}}'),
  json: Joi.boolean().default(false),

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
    // set console as default mode for log.console.*
    console: logSchema.keys({
      mode: Joi.string()
        .valid(...Object.values(loggingTransportTypes))
        .default('console'),
    }),

    // set file as default mode for log.file.*
    file: logSchema.keys({
      mode: Joi.string()
        .valid(...Object.values(loggingTransportTypes))
        .default('file'),
    }),
  })
    .unknown()
    .pattern(Joi.invalid(...Object.values(loggingTransportTypes)), logSchema)
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
