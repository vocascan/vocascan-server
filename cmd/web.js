const commander = require('commander');

const web = new commander.Command('web');

web.description('start the vocascan-server').action(() => {
  const runServer = require('../server');

  runServer();
});

module.exports = web;
