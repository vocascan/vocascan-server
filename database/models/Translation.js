const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = (sequelize) => {
  const Translation = sequelize.define(
    'Translation',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      vocabularyCardId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      languagePackageId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [1, 255] },
      },
    },
    {
      sequelize,
      tableName: 'translations',
    }
  );

  Translation.associate = (db) => {
    Translation.belongsTo(db.User, { foreignKey: 'userId' });
    Translation.belongsTo(db.VocabularyCard, { foreignKey: 'vocabularyCardId' });
    Translation.belongsTo(db.LanguagePackage, { foreignKey: 'languagePackageId' });
  };

  return Translation;
};
