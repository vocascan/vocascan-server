const { DataTypes } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.createTable('translations', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    vocabularyCardId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'vocabularyCards',
        key: 'id',
      },
    },
    languagePackageId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'languagePackages',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
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
  await queryInterface.dropTable('translations');
}

module.exports = { up, down };
