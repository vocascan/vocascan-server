const { DataTypes } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.createTable('languagePackages', {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foreignWordLanguage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    translatedWordLanguage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vocabsPerDay: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rightWords: {
      type: DataTypes.INTEGER,
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
  await queryInterface.dropTable('languagePackages');
}

module.exports = { up, down };
