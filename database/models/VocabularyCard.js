const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = (sequelize) => {
  const VocabularyCard = sequelize.define(
    'VocabularyCard',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      languagePackageId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      groupId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      drawerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastQuery: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    },
    {
      sequelize,
      tableName: 'vocabularyCards',
    }
  );

  VocabularyCard.associate = (db) => {
    VocabularyCard.hasMany(db.Translation);
  };

  return VocabularyCard;
};
