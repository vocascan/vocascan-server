const commander = require('commander');

const web = new commander.Command('web');

web.action(() => {
  const runServer = require('../server');

  runServer();
});

module.exports = web;
