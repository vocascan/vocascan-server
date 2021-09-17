const winston = require('winston');
const Mustache = require('mustache');

const config = require('../config');
const NullTransport = require('./NullTransport');
const { logLevels } = require('../../utils/constants');

// Disable escaping mustache templates
Mustache.escape = (value) => value;

// error formatter
const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

// format factory helper
const generateFormat = ({ colorize, format, json }) => {
  return winston.format.combine(
    enumerateErrorFormat(),
    colorize ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.printf((ctx) => Mustache.render(format, ctx)),
    ...(json ? [winston.format.json()] : [])
  );
};

// add colors
winston.addColors({
  ...logLevels.colors,
  sql: 'blue',
  router: 'yellow',
});

// define loggers
const loggers = new winston.Container();

const defaultLogger = loggers.add('default', {
  levels: logLevels.levels,
});

const sqlLogger = loggers.add('sql', {
  levels: { sql: 0 },
});

const routerLogger = loggers.add('router', {
  levels: { router: 0 },
});

// add logger transports
for (const [name, options] of Object.entries(config.log)) {
  let Transport = null;
  let transportOptions = { name };

  if (options.mode === 'console') {
    Transport = winston.transports.Console;
    transportOptions = {
      ...transportOptions,
      level: options.level,
      stderrLevels: options.stderr_levels,
    };
  } else if (options.mode === 'file') {
    Transport = winston.transports.File;
    transportOptions = {
      ...transportOptions,
      level: options.level,
      filename: options.filename,
      maxsize: options.max_size,
      maxFiles: options.max_files,
      zippedArchive: options.archive_logs,
    };
  }

  const basicFormatOptions = {
    colorize: options.colorize,
    json: options.json,
  };

  if (options.enable_default_log) {
    const transport = new Transport({
      ...transportOptions,
      format: generateFormat({ ...basicFormatOptions, format: options.format_default }),
    });

    defaultLogger.add(transport);
  }

  if (options.enable_sql_log) {
    const transport = new Transport({
      ...transportOptions,
      format: generateFormat({ ...basicFormatOptions, format: options.format_sql }),
      level: 'sql',
    });

    sqlLogger.add(transport);
  }

  if (options.enable_router_log) {
    const transport = new Transport({
      ...transportOptions,
      format: generateFormat({ ...basicFormatOptions, format: options.format_router }),
      level: 'router',
    });

    routerLogger.add(transport);
  }
}

// add null transport to prevent "[winston] Attempt to write logs with no transports"
for (const logger of [defaultLogger, sqlLogger, routerLogger]) {
  if (logger.transports.length === 0) {
    logger.add(new NullTransport());
  }
}

module.exports = defaultLogger;
module.exports.loggers = loggers;
module.exports.defaultLogger = defaultLogger;
module.exports.sqlLogger = sqlLogger;
module.exports.routerLogger = routerLogger;
