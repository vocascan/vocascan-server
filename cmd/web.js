const commander = require('commander');
const web = new commander.Command('web');

web
  .description('start the vocascan-server')
  .addOption(new commander.Option('-p, --port <port>'))
  .action(async (options) => {
    const { createServer } = require('../server');

    const config = {};

    if (options.port && !Number.isNaN(+options.port)) {
      config.server = {
        port: +options.port,
      };
    }

    const server = await createServer(config);
    server.start();
  });

module.exports = web;
