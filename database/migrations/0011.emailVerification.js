const { DataTypes } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('users', 'verified', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    after: 'roleId',
  });
  await queryInterface.addColumn('users', 'disabled', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    after: 'verified',
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('users', 'verified');
  await queryInterface.removeColumn('users', 'disabled');
}

module.exports = { up, down };
