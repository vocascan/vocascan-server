const { DataTypes } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('users', 'emailVerified', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    after: 'roleId',
  });
  await queryInterface.addColumn('users', 'disabled', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    after: 'emailVerified',
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('users', 'emailVerified');
  await queryInterface.removeColumn('users', 'disabled');
}

module.exports = { up, down };
