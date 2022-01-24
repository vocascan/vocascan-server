const { DataTypes } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('users', 'verified', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    after: 'roleId',
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('users', 'verified');
}

module.exports = { up, down };
