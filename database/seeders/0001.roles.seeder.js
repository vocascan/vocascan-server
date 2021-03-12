let roles = [
    {name: 'user', adminRights: 'false', createdAt: new Date(), updatedAt: new Date()},
    {name: 'admin', adminRights: 'true', createdAt: new Date(), updatedAt: new Date()},
];

async function up({ context: queryInterface }) {
  await queryInterface.getQueryInterface().bulkInsert('Roles', roles);
}

async function down({ context: queryInterface }) {
  await queryInterface.getQueryInterface().bulkDelete('Roles', { name: roles.map(u => u.name) });
}

module.exports = { up, down };