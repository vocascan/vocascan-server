// MODEL
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ForeignWord = sequelize.define(
    'ForeignWord',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
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
        }
    );

    ForeignWord.associate = (db) => {
    ForeignWord.hasMany(db.LanguagePackage);
  };

    return ForeignWord;
};