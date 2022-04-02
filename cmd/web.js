const commander = require('commander');

const { parseConfig } = require('../app/config/config');

const web = new commander.Command('web');

web.hook('preAction', async (thisCommand) => {
  // get options from first level command
  const opts = thisCommand.parent.opts();
  parseConfig({ configPath: opts.configFile });
});

web.description('start the vocascan-server').action(async () => {
  const { createServer } = require('../server');

  const server = await createServer();
  server.start();
});

module.exports = web;
