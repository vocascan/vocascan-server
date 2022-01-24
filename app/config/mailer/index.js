const nodemailer = require('nodemailer');

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
  } catch (err) {
    logger.error(`connection to email provider at "${config.mailer.host}" cannot be established`);
    logger.error(err);

    process.exit(1);
  }
};

const sendMail = async ({ to, subject, text, html }) => {
  const info = await transport.sendMail({
    to,
    subject,
    text,
    html,
  });

  console.log(info);
};

module.exports = { init, sendMail };
