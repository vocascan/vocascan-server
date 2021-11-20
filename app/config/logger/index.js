const winston = require('winston');
const chalk = require('chalk');

// disable node/no-extraneous-require because triple-beam is a dependency of winston
// eslint-disable-next-line node/no-extraneous-require
const { LEVEL, MESSAGE } = require('triple-beam');

const config = require('../config');
const NullTransport = require('./NullTransport');
const { logLevels, logTransportTypes } = require('../../utils/constants');
const { template } = require('../../utils');

// error formatter
const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

// remove all keys except level and message
const removeUnknownKeys = winston.format((info) => {
  return {
    level: info.level || info[LEVEL],
    message: info[MESSAGE],
    [LEVEL]: info.level || info[LEVEL],
    [MESSAGE]: info[MESSAGE],
  };
});

// format factory helper
const generateFormat = ({ colorize, format, json, mode }) => {
  const compiledTemplate = template(format);

  return winston.format.combine(
    enumerateErrorFormat(),
    ...(colorize ? [winston.format.colorize()] : []),
    winston.format.printf((ctx) => {
      if (!ctx.message) ctx.message = ctx[MESSAGE];
      const rendered = compiledTemplate({ chalk, ...ctx });
      return rendered;
    }),
    ...(mode === 'router' ? [removeUnknownKeys()] : []), // remove log context if mode is router
    ...(!colorize ? [winston.format.uncolorize()] : []),
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
  exitOnError: false,
});

const sqlLogger = loggers.add('sql', {
  levels: { sql: 0 },
});

const routerLogger = loggers.add('router', {
  levels: { router: 0 },
});

// add logger transports
for (const [name, options] of Object.entries(config.log)) {
  if (options.enable) {
    let Transport = null;
    let transportOptions = { name };

    if (options.mode === logTransportTypes.CONSOLE) {
      Transport = winston.transports.Console;
      transportOptions = {
        ...transportOptions,
        level: options.level,
        stderrLevels: options.stderr_levels,
      };
    } else if (options.mode === logTransportTypes.FILE) {
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
        handleExceptions: options.handle_exceptions,
        handleRejections: options.handle_rejections,
        format: generateFormat({ ...basicFormatOptions, format: options.format_default, mode: 'default' }),
      });

      defaultLogger.add(transport);
    }

    if (options.enable_sql_log) {
      const transport = new Transport({
        ...transportOptions,
        format: generateFormat({ ...basicFormatOptions, format: options.format_sql, mode: 'sql' }),
        level: 'sql',
      });

      sqlLogger.add(transport);
    }

    if (options.enable_router_log) {
      const transport = new Transport({
        ...transportOptions,
        format: generateFormat({ ...basicFormatOptions, format: options.format_router, mode: 'router' }),
        level: 'router',
      });

      routerLogger.add(transport);
    }
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
