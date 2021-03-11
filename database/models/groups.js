// MODEL
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Groups = sequelize.define(
    'groups',
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
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
        {
        sequelize,
        }
    );

    Groups.associate = (db) => {
    Groups.hasMany(db.File);
    Groups.hasOne(db.Setting);
    };

    return Groups;
};