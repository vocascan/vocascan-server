const Joi = require('../joi');
const { logTransportTypes, logLevels } = require('../../utils/constants');

// sub schemas
const logSchema = Joi.object({
  enable: Joi.boolean().default(true),
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
  format_default: Joi.string().default('{{level}}: {{message}}'),
  format_sql: Joi.string().default('{{message}}'),
  format_router: Joi.string().default(
    '{{tokens.remoteAddr}} - "{{req.user ? req.user.username : "no user"}}" {{tokens.date("clf")}} "{{tokens.method}} {{tokens.url}}" {{tokens.colorizedStatus}} {{tokens.res("content-length")}} "{{tokens.userAgent}}" - {{tokens.responseTime(3)}}ms'
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

// main schema
const configSchema = Joi.object({
  debug: Joi.boolean().default(false),

  server: Joi.object({
    port: Joi.number().default(5000).min(1).max(65535),
    jwt_secret: Joi.string().required(),
    salt_rounds: Joi.number().integer().min(0).max(20).default(10),
    registration_locked: Joi.boolean().default(false),
    cors: Joi.keyArray().default(['*']),
  }).required(),

  database: Joi.object({
    connection_url: Joi.string(),
    dialect: Joi.string().valid('mysql', 'mariadb', 'postgres', 'sqlite'),
    storage: Joi.string().when('dialect', { is: 'sqlite', then: Joi.required(), otherwise: Joi.forbidden() }),
    host: Joi.string().when('dialect', { not: 'sqlite', then: Joi.required(), otherwise: Joi.forbidden() }),
    port: Joi.string().when('dialect', { not: 'sqlite', then: Joi.required(), otherwise: Joi.forbidden() }),
    username: Joi.string().when('dialect', { not: 'sqlite', then: Joi.required(), otherwise: Joi.forbidden() }),
    password: Joi.string().when('dialect', { not: 'sqlite', then: Joi.required(), otherwise: Joi.forbidden() }),
    database: Joi.string().when('dialect', { not: 'sqlite', then: Joi.required(), otherwise: Joi.forbidden() }),
  })
    .or('connection_url', 'dialect')
    .required(),

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

  api: Joi.object({
    enable_swagger: Joi.boolean().default(true),
  }).default({}),
});

module.exports = configSchema;
