let roles = [
    {name: 'user', admin_rights: 'false', createdAt: new Date(), updatedAt: new Date()},
    {name: 'admin', admin_rights: 'true', createdAt: new Date(), updatedAt: new Date()},
];

async function up({ context: queryInterface }) {
  await queryInterface.getQueryInterface().bulkInsert('roles', roles);
}

async function down({ context: queryInterface }) {
  await queryInterface.getQueryInterface().bulkDelete('roles', { name: roles.map(u => u.name) });
}

module.exports = { up, down };