const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = (sequelize) => {
  const LanguagePackage = sequelize.define(
    'LanguagePackage',
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [1, 55] },
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
        validate: { min: 1, max: 255 },
      },
      rightWords: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 10 },
      },
    },
    {
      sequelize,
      tableName: 'languagePackages',
    }
  );

  LanguagePackage.associate = (db) => {
    LanguagePackage.belongsTo(db.User, { foreignKey: 'userId' });
    LanguagePackage.belongsTo(db.Language, { foreignKey: 'foreignWordLanguage', as: 'ForeignWordLanguage' });
    LanguagePackage.belongsTo(db.Language, { foreignKey: 'translatedWordLanguage', as: 'TranslatedWordLanguage' });

    LanguagePackage.hasMany(db.Drawer, { foreignKey: 'languagePackageId', onDelete: 'cascade', hooks: true });
    LanguagePackage.hasMany(db.Group, { foreignKey: 'languagePackageId', onDelete: 'cascade', hooks: true });
    LanguagePackage.hasMany(db.PackageProgress, { foreignKey: 'languagePackageId', onDelete: 'cascade', hooks: true });
    LanguagePackage.hasMany(db.Translation, { foreignKey: 'languagePackageId', onDelete: 'cascade', hooks: true });
    LanguagePackage.hasMany(db.VocabularyCard, { foreignKey: 'languagePackageId', onDelete: 'cascade', hooks: true });
  };

  return LanguagePackage;
};
