// MODEL
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const LanguagePackages = sequelize.define(
    'language_packages',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        foreign_word_language: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        translated_word_language: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        vocabs_per_day: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        right_words: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
        {
        sequelize,
        }
    );

    LanguagePackages.associate = (db) => {
    LanguagePackages.hasMany(db.File);
    LanguagePackages.hasOne(db.Setting);
    };

    return LanguagePackages;
};