const commander = require('commander');
const bcrypt = require('bcrypt');
const { Table } = require('console-table-printer');
const { truncateString, generateRandomString, hashEmail, askToConfirm } = require('../../app/utils');
const { parseConfig } = require('../../app/config/config');
const db = require('../../database');
const chalk = require('chalk');

let config = {};

const userHandler = new commander.Command('user');

const generateUserTable = (users) => {
  const table = new Table({ disabledColumns: ['roleId', 'Role'] });

  table.addRows(
    users.map((item) => {
      let user = item;
      let truncatedFields = {};

      if (Array.isArray(item)) {
        [user, truncatedFields] = item;
      }

      return {
        ...user.toJSON(),
        email: truncatedFields.email || truncateString(user.email),
        password: truncatedFields.password || truncateString(user.password),
        ...(user.Role ? { role: user.Role.name } : {}),
        createdAt: user.createdAt.toLocaleString(),
        updatedAt: user.updatedAt.toLocaleString(),
      };
    })
  );

  return table;
};

userHandler.description('manage vocascan users');

userHandler.hook('preAction', async (thisCommand) => {
  // get options from first level command
  const opts = thisCommand.parent.parent.opts();
  config = parseConfig({ configPath: opts.configFile });

  // init database
  await db.init();
});

userHandler
  .command('create')
  .description('create a user')
  .addOption(new commander.Option('-u, --username <username>').makeOptionMandatory())
  .addOption(new commander.Option('-e, --email <email>').makeOptionMandatory())
  .addOption(new commander.Option('-p, --password <password>'))
  .addOption(new commander.Option('-r, --role <name>', 'chose a role for the new user').default('user'))
  .action(async (options) => {
    const { User, Role } = db;

    // check if role exists
    const role = await Role.findOne({
      where: {
        name: options.role,
      },
    });

    if (!role) {
      return console.error(chalk`{red ✗} role does not exist`);
    }

    // generate password
    let password = options.password;
    if (!password) {
      password = generateRandomString(48);
    }
    const passwordHash = await bcrypt.hash(password, config.server.salt_rounds);

    // hash email
    const emailHash = hashEmail(options.email);

    // create user
    const user = User.build({
      username: options.username,
      email: emailHash,
      password: passwordHash,
      roleId: role.id,
    });
    user.Role = role;
    await user.save();

    console.log(chalk`{green ✓} created 1 user`);

    const table = generateUserTable([[user, { email: options.email, password }]]);

    return table.printTable();
  });

userHandler
  .command('list')
  .description('list all users')
  .addOption(new commander.Option('-r, --role <name>', 'filter for a specific role'))
  .action(async (options) => {
    const { User, Role } = db;

    const users = await User.findAll({
      where: {
        ...(options.role ? { '$role.name$': options.role } : {}),
      },
      include: [
        {
          model: Role,
          fields: ['name'],
        },
      ],
    });

    if (users.length === 0) {
      return console.error(chalk`{red ✗} no users found`);
    }

    console.log(chalk`{green ✓} found ${users.length} users`);

    const table = generateUserTable(users);

    return table.printTable();
  });

userHandler
  .command('update')
  .description('update users role or password')
  .addOption(new commander.Option('-i, --id <id>'))
  .addOption(new commander.Option('-u, --username <username>'))
  .addOption(new commander.Option('-p, --password <password>'))
  .addOption(new commander.Option('-r, --role <name>'))
  .action(async (options) => {
    const { User, Role } = db;

    // check if one option to identify is set
    if (!options.id && !options.username) {
      return console.error(
        chalk`{red error:} one of '-i, --id <id>' or '-u, --username <username>' should be set to identify the user.`
      );
    }

    // check if one option to change is set
    if (!options.password && !options.role) {
      return console.error(
        chalk`{red error:} one of '-p, --password <password>' or '-r, --role <role>' should be set to change.`
      );
    }

    // check if user exists
    const user = await User.findOne({
      where: {
        ...(options.id ? { id: options.id } : {}),
        ...(options.username ? { username: options.username } : {}),
      },
      include: [
        {
          model: Role,
          fields: ['name'],
        },
      ],
    });

    if (!user) {
      return console.error(chalk`{red ✗} user does not exist`);
    }

    if (options.password) {
      const passwordHash = await bcrypt.hash(options.password, config.server.salt_rounds);
      user.password = passwordHash;
    }

    if (options.role) {
      // check if role exists
      const role = await Role.findOne({
        where: {
          name: options.role,
        },
      });

      if (!role) {
        return console.error(chalk`{red ✗} role does not exist`);
      }

      user.roleId = role.id;
      user.Role = role;
    }

    await user.save();

    console.log(chalk`{green ✓} updated 1 user`);

    const table = generateUserTable([[user, { email: options.email, password: options.password }]]);

    return table.printTable();
  });

userHandler
  .command('delete')
  .description('delete a user')
  .addOption(new commander.Option('-i, --id <id>'))
  .addOption(new commander.Option('-u, --username <username>'))
  .addOption(new commander.Option('-y, --yes'))
  .action(async (options) => {
    const { User, Role } = db;

    // check if one option to identify is set
    if (!options.id && !options.username) {
      return console.error(
        chalk`{red error:} one of '-i, --id <id>' or '-u, --username <username>' should be set to identify the user.`
      );
    }

    // check if user exists
    const user = await User.findOne({
      where: {
        ...(options.id ? { id: options.id } : {}),
        ...(options.username ? { username: options.username } : {}),
      },
      include: [
        {
          model: Role,
          fields: ['name'],
        },
      ],
    });

    if (!user) {
      return console.error(chalk`{red ✗} user does not exist`);
    }

    const table = generateUserTable([[user, { email: options.email, password: options.password }]]);
    table.printTable();

    if (!options.yes) {
      const confirmed = await askToConfirm('Are you sure, you want to delete this user?');

      if (!confirmed) {
        return console.log(chalk`{red ✗} no user deleted`);
      }
    }

    await user.destroy();

    return console.log(chalk`{green ✓} deleted 1 user`);
  });

module.exports = userHandler;
