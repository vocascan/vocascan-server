const { DataTypes } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.createTable('inviteCodes', {
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
        model: 'user',
        key: 'id',
        as: 'userId',
      },
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    uses: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxUses: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: true,
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
  await queryInterface.dropTable('inviteCodes');
}

module.exports = { up, down };
