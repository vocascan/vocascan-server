const morgan = require('morgan');
const { routerLogger } = require('../config/logger');

const LoggingMiddleware = morgan((tokens, req, res) => {
  const morganTokens = {
    get url() {
      return tokens.url(req, res);
    },
    get method() {
      return tokens.method(req, res);
    },
    responseTime(digits) {
      return tokens['response-time'](req, res, digits);
    },
    totalTime(digits) {
      return tokens['total-time'](req, res, digits);
    },
    date(format) {
      return tokens.date(req, res, format);
    },
    get status() {
      return tokens.status(req, res);
    },
    get colorizedStatus() {
      const statusCode = tokens.status(req, res);
      let color = '';

      if (statusCode >= 500) {
        // 5xx - Server errors (500–599)
        color = 'red';
      } else if (statusCode >= 400) {
        // 4xx - Client errors (400–499)
        color = 'yellow';
      } else if (statusCode >= 300) {
        // 3xx - Redirects (300–399)
        color = 'cyan';
      } else if (statusCode >= 200) {
        // 2xx - Successful responses (200–299)
        color = 'green';
      } else if (statusCode >= 100) {
        // 1xx - Informational responses (100–199)
        color = 'blue';
      }

      return `{${color} ${statusCode}}`;
    },
    get referrer() {
      return tokens.referrer(req, res);
    },
    get remoteAddr() {
      return tokens['remote-addr'](req, res);
    },
    get httpVersion() {
      return tokens['http-version'](req, res);
    },
    get userAgent() {
      return tokens['user-agent'](req, res);
    },
    req(field) {
      return tokens.req(req, res, field);
    },
    res(field) {
      return tokens.res(req, res, field);
    },
  };

  routerLogger.log('router', { req, res, tokens: morganTokens });
});

module.exports = LoggingMiddleware;
