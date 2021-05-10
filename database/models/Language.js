const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Language = sequelize.define(
    'Language',
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nativeNames: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rtl: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'languages',
    }
  );

  Language.associate = (db) => {
    Language.hasMany(db.LanguagePackage, { foreignKey: 'foreignWordLanguage', as: 'ForeignWordLanguage' });
    Language.hasMany(db.LanguagePackage, { foreignKey: 'translatedWordLanguage', as: 'TranslatedWordLanguage' });
  };

  return Language;
};
