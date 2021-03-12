// MODEL
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ForeignWord = sequelize.define(
    'ForeignWord',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        languagePackageId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        groupId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        drawerId: {
            type: DataTypes.INTEGER,
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