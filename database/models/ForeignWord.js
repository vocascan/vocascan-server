const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = (sequelize) => {
  const ForeignWord = sequelize.define(
    'ForeignWord',
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
    },
    {
      sequelize,
      tableName: 'foreignWords',
    }
  );

  ForeignWord.associate = (db) => {
    ForeignWord.hasMany(db.LanguagePackage);
  };

  return ForeignWord;
};
