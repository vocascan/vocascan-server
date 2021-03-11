// MODEL
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ForeignWords = sequelize.define(
    'foreign_words',
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
        language_package_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'language_packages',
                key: 'id'
            }
        },
        group_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'groups',
                key: 'id'
            }
        },
        drawer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'drawers',
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

    ForeignWords.associate = (db) => {
    ForeignWords.hasMany(db.File);
    ForeignWords.hasOne(db.Setting);
    };

    return ForeignWords;
};