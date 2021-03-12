// MODEL
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Group = sequelize.define(
    'Group',
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
    
    return Group;
};