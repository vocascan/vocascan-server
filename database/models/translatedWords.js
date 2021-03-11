// MODEL
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TranslatedWords = sequelize.define(
    'translated_words',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        foreign_word_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'foreign_words',
                key: 'id'
            }
        },
        language_package_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'language_packages',
                key: 'id'
            }
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

    TranslatedWords.associate = (db) => {
    TranslatedWords.hasMany(db.File);
    TranslatedWords.hasOne(db.Setting);
    };

    return TranslatedWords;
};