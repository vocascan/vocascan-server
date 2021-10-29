#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const commander = require('commander');
const { version } = require('./package.json');

const program = new commander.Command();

program
  .version(version)
  .option('-c --config-file <path>', 'specify a path to a custom configuration file')
  .parseOptions(process.argv);

const opts = program.opts();

require('./app/config/config').parseConfig({ configPath: opts.configFile });

// read commands folder
for (const cmdHandler of fs.readdirSync(path.resolve('cmd'), { withFileTypes: true })) {
  const fullPath = path.resolve('cmd', cmdHandler.name);

  // check if command has sub commands in its own directory
  if (cmdHandler.isDirectory()) {
    const indexPath = path.resolve(fullPath, 'index.js');
    const cmdHandlerName = cmdHandler.name.replace(/\.[^/.]+$/, '');
    let handler = new commander.Command(cmdHandlerName);

    // if index file in sub directory exists, use that as a main handler
    if (fs.existsSync(indexPath)) {
      handler = require(indexPath);
    }

    // add sub commands
    for (const subCmdHandler of fs.readdirSync(fullPath)) {
      handler.addCommand(require(path.resolve(fullPath, subCmdHandler)));
    }

    // register main handler to the program
    program.addCommand(handler);
  } else {
    // its a file so command has no external sub commands folder
    program.addCommand(require(fullPath));
  }
}

program.parse(process.argv);
