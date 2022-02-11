/**
 * For more help with the file see https://docs.vocascan.com/#/vocascan-server/configuration
 * This config file lists all available options
 */

module.exports = {
  debug: false,

  server: {
    base_url: 'http://example.com',
    port: 5000,
    jwt_secret: '',
    salt_rounds: 10,
    cors: ['https://web.example1.com', 'https://web.example2.com'],
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
      enable: true,
      mode: 'console',
      level: 'info',
      colorize: true,
      enable_default_log: true,
      enable_sql_log: true,
      enable_router_log: true,
      format_default: '{{level}}: {{message}}',
      format_sql: '{{message}}',
      format_router:
        '{{tokens.remoteAddr}} - "{{req.user ? req.user.username : "no user"}}" {{tokens.date("clf")}} "{{tokens.method}} {{tokens.url}}" {{tokens.colorizedStatus}} {{tokens.res("content-length")}} "{{tokens.userAgent}}" - {{tokens.responseTime(3)}}ms',
      json: false,
      handle_exceptions: true,
      handle_rejections: true,
      stderr_levels: ['error'],
    },
    file: {
      enable: true,
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

  api: {
    enable_swagger: true,
  },

  pages: {
    privacyPolicy: {
      url: '/p/privacy-policy',
      fallback: { type: 'redirect', location: '/p/privacy-policy?lang=de' },
      langs: {
        en: { type: 'file', location: './staticPages/privacy-policy_en.html' },
        de: { type: 'file', location: './staticPages/privacy-policy_de.html' },
        ru: { type: 'file', location: './staticPages/privacy-policy_ru.html' },
      },
    },
  },

  mailer: {
    enabled: true,
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: '',
      pass: '',
    },
    from: '"Vocascan" <vocascan@example.com>',
  },

  service: {
    invite_code: false,
    email_confirm: true,
    email_confirm_live_time: '2h',
    email_confirm_level: 'medium',
    email_confirm_time: '14d',
    access_live_time: '30d',
  },
};
