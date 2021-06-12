const { DataTypes } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.createTable('packageProgress', {
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    learnedTodayCorrect: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    learnedTodayWrong: {
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
  await queryInterface.dropTable('packageProgress');
}

module.exports = { up, down };
