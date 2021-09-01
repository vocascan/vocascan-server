const { v4: uuid } = require('uuid');
const { User, Role } = require('../../database');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const getRoleId = async () => {
  const roleId = await Role.findOne({
    attributes: ['id'],
    where: {
      name: 'admin',
    },
  });

  return roleId.toJSON().id;
};

const hashPassword = async (password) => {
  const hash = await bcrypt.hash(password, +process.env.SALT_ROUNDS);
  return hash;
};

const createAdminUser = async () => {
  const admin = [
    {
      id: uuid(),
      username: 'admin',
      email: crypto.createHash('sha256').update('admin').digest('base64'),
      password: await hashPassword(process.env.DB_PASSWORD),
      roleId: await getRoleId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  return admin;
};

async function up({ context: queryInterface }) {
  await queryInterface.bulkInsert('users', await createAdminUser());
}

async function down({ context: queryInterface }) {
  await queryInterface.bulkDelete('users', { username: User.map((u) => u.username) });
}

module.exports = { up, down };
