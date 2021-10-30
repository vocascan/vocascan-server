const commander = require('commander');

const admin = new commander.Command('admin');

admin.description('manage admin resources');

module.exports = admin;
