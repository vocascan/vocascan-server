const { DataTypes } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.createTable('translatedWords', {
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
    foreignWordId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'foreignWords',
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
  await queryInterface.dropTable('translatedWords');
}

module.exports = { up, down };
