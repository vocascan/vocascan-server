// MODEL
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Drawers = sequelize.define(
    'drawers',
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
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        query_interval: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
        {
        sequelize,
        }
    );

    Drawers.associate = (db) => {
    Drawers.hasMany(db.File);
    Drawers.hasOne(db.Setting);
    };

    return Drawers;
};