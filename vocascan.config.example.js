/**
 * For more help with the file see https://docs.vocascan.com/#/vocascan-server/configuration
 * This config file lists all available options
 */

module.exports = {
  debug: false,

  server: {
    port: 5000,
    jwt_secret: '',
    salt_rounds: 10,
  },

  database: {
    connection_url: '',
    dialect: '',
    storage: '',
    host: '',
    port: '',
    username: '',
    password: '',
    database: '',
  },

  log: {
    my_console_logger: {
      mode: 'console',
      level: 'info',
      colorize: true,
      enable_default_log: true,
      enable_sql_log: true,
      enable_router_log: true,
      format_default: '{{.level}}: {{.message}}',
      format_sql: '{{.message}}',
      format_router:
        '{{.tokens.remoteAddr}} - "{{.req.user ? _.req.user.username : "no user"}}" {{.tokens.date("clf")}} "{{.tokens.method}} {{.tokens.url}}" {{.tokens.colorizedStatus}} {{.tokens.res("content-length")}} "{{.tokens.userAgent}}" - {{.tokens.responseTime(3)}}ms',
      json: false,
      handle_exceptions: true,
      handle_rejections: true,
      stderr_levels: ['error'],
    },
    file: {
      mode: 'file',
      level: 'info',
      enable_sql_log: true,
      enable_router_log: true,
      filename: './logs/vocascan.log',
      max_size: 100000,
      max_files: 3,
      archive_logs: true,
    },
  },
};
