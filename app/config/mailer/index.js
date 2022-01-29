const path = require('path');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const mjml = require('mjml');
const chalk = require('chalk');

const logger = require('../logger');
const config = require('../config');

let transport = null;

const init = async () => {
  if (!config.mailer || !config.mailer.enabled) return;

  transport = nodemailer.createTransport(
    {
      host: config.mailer.host,
      port: config.mailer.port,
      secure: config.mailer.secure,
      auth: config.mailer.auth,
    },
    {
      from: config.mailer.from,
    }
  );

  try {
    await transport.verify();

    logger.info(chalk`{green ✓} Connected to email server`);
  } catch (err) {
    logger.error(`Unable to connect to email server.`);
    logger.error(err);
  }
};

const sendMail = async ({ to, subject, template, text, ctx }) => {
  const parsed = await ejs.renderFile(path.resolve(__dirname, '../../Templates/mailer', template), ctx, {
    cache: true,
  });

  const result = mjml(parsed);

  const info = await transport.sendMail({
    to,
    subject,
    text,
    html: result.html,
  });

  logger.debug(`Email was successfully send to ${to}`);

  return info;
};

module.exports = { init, sendMail };
