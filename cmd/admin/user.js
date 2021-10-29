const commander = require('commander');
const { Table } = require('console-table-printer');
const { truncateString } = require('../../app/utils');
const db = require('../../database');

const userHandler = new commander.Command('user');

userHandler.command('list').action(async () => {
  await db.init();
  const { User, Role } = db;

  const users = await User.findAll({
    include: [
      {
        model: Role,
        fields: ['name'],
      },
    ],
  });

  const table = new Table({ disabledColumns: ['roleId', 'Role'] });

  table.addRows(
    users.map((user) => ({
      ...user.toJSON(),
      email: truncateString(user.email),
      password: truncateString(user.password),
      role: user.Role.name,
      createdAt: user.createdAt.toLocaleString(),
      updatedAt: user.updatedAt.toLocaleString(),
    }))
  );

  table.printTable();
});

module.exports = userHandler;
