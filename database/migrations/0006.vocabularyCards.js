const { DataTypes } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.createTable('vocabularyCards', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'users',
        key: 'id',
        as: 'userId',
      },
    },
    languagePackageId: {
      type: DataTypes.UUID,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'languagePackages',
        key: 'id',
        as: 'languagePackageId',
      },
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'groups',
        key: 'id',
        as: 'groupId',
      },
    },
    drawerId: {
      type: DataTypes.UUID,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'drawers',
        key: 'id',
        as: 'drawerId',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastQuery: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('vocabularyCards');
}

module.exports = { up, down };
