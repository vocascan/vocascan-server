// MODEL
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TranslatedWord = sequelize.define(
    'TranslatedWord',
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
        foreignWordId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        languagePackageId: {
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

    return TranslatedWord;
};