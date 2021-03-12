// MODEL
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Drawer = sequelize.define(
    'Drawer',
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
        queryInterval: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
        {
        sequelize,
        }
    );


    return Drawer;
};