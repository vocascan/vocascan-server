const { uuid } = require('uuidv4');

const roles = [
  {
    id: uuid(),
    name: 'user',
    adminRights: 'false',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    name: 'admin',
    adminRights: 'true',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function up({ context: queryInterface }) {
  await queryInterface.bulkInsert('roles', roles);
}

async function down({ context: queryInterface }) {
  await queryInterface.bulkDelete('roles', { name: roles.map((u) => u.name) });
}

module.exports = { up, down };
