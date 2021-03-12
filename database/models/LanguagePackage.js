// MODEL
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const LanguagePackage = sequelize.define(
    'LanguagePackage',
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
        name: {
            type: DataTypes.STRING,
            allowNull: false,
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
        },
        rightWords: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
        {
        sequelize,
        }
    );
    
    return LanguagePackage;
};